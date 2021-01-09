import { getRepository } from 'typeorm';
import { AssignedIssue } from '../entity/assignedIssues';
import { Issue } from '../entity/issue';
import { SupportAgent } from '../entity/supportAgent';
import SupportAgentService from '../supportAgent/supportAgent.service';
import AssignedIssueService from './assignedIssue.service';
import { CreateIssueDTO } from './dto/create-issue.dto';

export default class IssueService {
    static async getAll(): Promise<Issue[]> {
        const issueRepository = await getRepository(Issue);
        return issueRepository.find();
    }

    static async reportNewIssue(createIssueDTO: CreateIssueDTO): Promise<Issue> {
        const issue = new Issue();
        issue.title = createIssueDTO.title;
        issue.description = createIssueDTO.description;

        const issueRepository = await getRepository(Issue);
        const newIssue = await issueRepository.save(issue);

        const availableSupportAgent = await SupportAgentService.getAvailableSupportAgent();

        if (availableSupportAgent) {
            await this.assignIssue(issue, availableSupportAgent);
        }

        return newIssue;
    }

    static async assignIssue(issue: Issue, supportAgent: SupportAgent): Promise<void> {
        supportAgent.available = false;

        await Promise.all([
            getRepository(SupportAgent)
                .save(supportAgent),
            getRepository(AssignedIssue)
                .save({ issue, supportAgent })
        ]);
    }

    static async resolveIssue(issueId: string) {
        const issueRepository = await getRepository(Issue);
        const issue = await issueRepository.findOne(issueId);

        if (!issue) {
            throw new Error(`Issue with id of ${issueId} does not exist.`);
        }

        if (issue.resolved) {
            throw new Error(`Issue with id of ${issueId} has already been resolved.`);
        }

        const assignedIssue = await AssignedIssueService.removeIssue(issueId);

        issue.resolved = true;
        await Promise.all([
            issueRepository.save(issue),
            SupportAgentService.setAgentToAvailable(assignedIssue.supportAgentId),
        ]);

        return issue;
    }
}