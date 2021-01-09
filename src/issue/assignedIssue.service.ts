import { getRepository } from 'typeorm';
import { AssignedIssue } from '../entity/assignedIssues';

export default class AssignedIssueService {
    static async removeIssue(issueId: string): Promise<AssignedIssue> {
        const assignedIssueRepository = await getRepository(AssignedIssue);
        const assignedIssue = await assignedIssueRepository.findOne({
            where: {
                issue: {
                    id: issueId,
                }
            },
        });

        await assignedIssueRepository.remove(assignedIssue);
        return assignedIssue;
    }
}