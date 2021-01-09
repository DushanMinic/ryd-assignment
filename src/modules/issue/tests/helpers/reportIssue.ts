import { CreateIssueDTO } from '../../dto/create-issue.dto';
import { request } from '../index.spec';

export async function reportNewIssue({
    title = 'My computer is not working',
    description = `'Ive tried restarting, but to no avail.`,
} = {}) {

    const issue: CreateIssueDTO = {
        title,
        description,
    };

    const { body: response } = await request.post('/issues')
        .send(issue)
        .expect(200);

    return response;
}