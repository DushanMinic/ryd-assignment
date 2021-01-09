import Express, { Request, Response } from 'express';
import { Issue } from '../../entity/issue';
import HandleError from '../../middleware/errorHandling';
import IssueService from './issue.service';

const Router = Express.Router();

Router.post('/issues', HandleError(async (request: Request, response: Response): Promise<Response> => {
    const issue = await IssueService.reportNewIssue(request.body);

    return response.send(issue);
}));

Router.get('/issues', HandleError(async (request: Request, response: Response): Promise<Response> => {
    const issues = await IssueService.getAll();

    return response.send(issues);
}));

Router.patch('/issues/:issueId', HandleError(async (request: Request, response: Response): Promise<Response> => {
    const { issueId } = request.params;
    const resolvedIssue = await IssueService.resolveIssue(issueId);

    return response.send(resolvedIssue);
}));

export default Router;