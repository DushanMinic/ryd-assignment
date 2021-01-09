import { getRepository } from 'typeorm';
import { Issue } from '../../entity/issue';
import SupportAgentService from '../supportAgent/supportAgent.service';
import AssignedIssueService from './assignedIssue.service';
import { CreateIssueDTO } from './dto/create-issue.dto';
import { IssueStatus } from './enum/issueStatus.enum';

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
            await SupportAgentService.assignIssue(issue, availableSupportAgent);
        }

        return newIssue;
    }

    static async resolveIssue(issueId: string) {
        const issueRepository = await getRepository(Issue);
        const issue = await issueRepository.findOne(issueId);

        if (!issue) {
            throw new Error(`Issue with id of ${issueId} does not exist.`);
        }

        if (issue.status !== IssueStatus.PROCESSING) {
            throw new Error(`Issue with id of ${issueId} is not in processing status.`);
        }

        const assignedIssue = await AssignedIssueService.getAssignedIssue(issueId);
        await AssignedIssueService.removeIssue(assignedIssue);

        issue.status = IssueStatus.RESOLVED;
        await issueRepository.save(issue);

        await SupportAgentService.assignUnresolvedIssue(assignedIssue.supportAgent);

        return issue;
    }

    static async getUnresolvedIssue(): Promise<Issue> {
        return getRepository(Issue)
            .findOne({
                where: {
                    status: IssueStatus.UNRESOLVED,
                },
            });
    }

    static async setIssueToProcessing(issue: Issue): Promise<Issue> {
        issue.status = IssueStatus.PROCESSING;

        return getRepository(Issue)
            .save(issue);
    }
}