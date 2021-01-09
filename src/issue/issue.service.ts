import { getRepository } from 'typeorm';
import { AssignedIssue } from '../entity/assignedIssues';
import { Issue } from '../entity/issue';
import { SupportAgent } from '../entity/supportAgent';
import SupportAgentService from '../supportAgent/supportAgent.service';
import { CreateIssueDTO } from './dto/create-issue.dto';

export default class IssueService {
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
}