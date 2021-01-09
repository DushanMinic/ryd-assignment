import { expect } from 'chai';
import { getRepository } from 'typeorm';
import { SupportAgent } from '../../../supportAgent/entity/supportAgent.entity';
import { CreateIssueDTO } from '../../dto/create-issue.dto';
import { IssueStatus } from '../../enum/issueStatus.enum';
import { reportNewIssue } from '../helpers/reportIssue';

describe('Report new issue with or without available Support Agents', () => {
    it('Should report a new issue while there is an available Support Agent', async () => {
        const supportAgentEntity = new SupportAgent();
        supportAgentEntity.firstName = 'Nikola';
        supportAgentEntity.lastName = 'Tesla';
        const supportAgentRepository = await getRepository(SupportAgent);
        const supportAgent = await supportAgentRepository.save(supportAgentEntity);

        const issue: CreateIssueDTO = {
            title: 'My computer is not working',
            description: `'Ive tried restarting, but to no avail.`,
        };

        const response = await reportNewIssue();

        expect(response.title).to.equals(issue.title);
        expect(response.description).to.equals(issue.description);
        expect(response.status).to.equals(IssueStatus.PROCESSING);

        const supportAgentAfterIssue = await supportAgentRepository.findOne({ where: { id: supportAgent.id } });
        expect(supportAgentAfterIssue.available).to.equals(false);
    });

    it('Should report a new issue while there is no available Support Agents', async () => {
        const issue: CreateIssueDTO = {
            title: 'My computer is not working',
            description: `'Ive tried restarting, but to no avail.`,
        };

        const response = await reportNewIssue();

        expect(response.title).to.equals(issue.title);
        expect(response.description).to.equals(issue.description);
        expect(response.status).to.equals(IssueStatus.UNRESOLVED);
    });
});