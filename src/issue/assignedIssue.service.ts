import { getRepository } from 'typeorm';
import { AssignedIssue } from '../entity/assignedIssues';
import { Issue } from '../entity/issue';
import { SupportAgent } from '../entity/supportAgent';

export default class AssignedIssueService {
    static async create(issue: Issue, supportAgent: SupportAgent): Promise<AssignedIssue> {
        return getRepository(AssignedIssue)
            .save({ issue, supportAgent })
    }

    static async getAssignedIssue(issueId: string): Promise<AssignedIssue> {
        return getRepository(AssignedIssue)
            .findOne({ where: { issueId }, relations: ['supportAgent'] });
    }

    static async removeIssue(assignedIssue: AssignedIssue): Promise<void> {
        const assignedIssueRepository = await getRepository(AssignedIssue);
        await assignedIssueRepository.remove(assignedIssue);
    }
}