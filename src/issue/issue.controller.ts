import Express, { Request, Response } from 'express';
import HandleError from '../middleware/errorHandling';
import IssueService from './issue.service';

const Router = Express.Router();

Router.post('/issues', HandleError(async (request: Request, response: Response): Promise<Response> => {
    const issue = await IssueService.reportNewIssue(request.body);

    return response.send(issue);
}));

export default Router;