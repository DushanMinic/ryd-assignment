import { getRepository } from 'typeorm';
import { Issue } from '../entity/issue';
import { CreateIssueDTO } from './dto/create-issue.dto';

export default class IssueService {
    static async reportNewIssue(createIssueDTO: CreateIssueDTO): Promise<Issue> {
        const newIssue = new Issue();
        newIssue.title = createIssueDTO.title;
        newIssue.description = createIssueDTO.description;

        const issueRepository = await getRepository(Issue);
        return issueRepository.save(newIssue);
    }
}