import Express, { Request, Response } from 'express';
import HandleError from '../../middleware/errorHandling';
import IssueService from './issue.service';
import { newIssueValidation, resolveIssueValidation } from './validation/issue.validation';

const Router = Express.Router();

Router.post('/issues', newIssueValidation,
    HandleError(async (request: Request, response: Response): Promise<Response> => {
        const issue = await IssueService.reportNewIssue(request.body);

        return response.send(issue);
    }));

Router.get('/issues',
    HandleError(async (request: Request, response: Response): Promise<Response> => {
        const issues = await IssueService.getAll();

        return response.send(issues);
    }));

Router.patch('/issues/:issueId', resolveIssueValidation,
    HandleError(async (request: Request, response: Response): Promise<Response> => {
        const { issueId } = request.params;
        const resolvedIssue = await IssueService.resolveIssue(issueId);

        return response.send(resolvedIssue);
    }));

export default Router;