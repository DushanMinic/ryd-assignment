import { getRepository } from 'typeorm';
import { AssignedIssue } from '../../entity/assignedIssues';
import { Issue } from '../../entity/issue';
import { SupportAgent } from '../../entity/supportAgent';
import AssignedIssueService from '../issue/assignedIssue.service';
import IssueService from '../issue/issue.service';

export default class SupportAgentService {
    static async getAvailableSupportAgent(): Promise<SupportAgent> {
        return getRepository(SupportAgent)
            .findOne({
                where: {
                    available: true,
                }
            });
    }

    static async setAgentAvailability(supportAgent: SupportAgent, available: boolean): Promise<SupportAgent> {
        supportAgent.available = available;
        return getRepository(SupportAgent)
            .save(supportAgent);

    }

    static async assignIssue(issue: Issue, supportAgent: SupportAgent): Promise<void> {
        await Promise.all([
            this.setAgentAvailability(supportAgent, false),
            AssignedIssueService.create(issue, supportAgent),
            IssueService.setIssueToProcessing(issue),
        ]);
    }

    static async assignUnresolvedIssue(supportAgent: SupportAgent): Promise<void> {
        const unresolvedIssue = await IssueService.getUnresolvedIssue();

        if (unresolvedIssue) {
            await this.assignIssue(unresolvedIssue, supportAgent);
        } else {
            await this.setAgentAvailability(supportAgent, true);
        }
    }
}