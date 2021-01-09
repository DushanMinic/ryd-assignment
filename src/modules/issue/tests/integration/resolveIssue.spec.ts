import { expect } from 'chai';
import { getRepository } from 'typeorm';
import { SupportAgent } from '../../../supportAgent/entity/supportAgent.entity';
import { AssignedIssue } from '../../entity/assignedIssues.entity';
import { Issue } from '../../entity/issue.entity';
import { IssueStatus } from '../../enum/issueStatus.enum';
import { reportNewIssue } from '../helpers/reportIssue';
import { request } from '../index.spec';

describe('Resolve Issue tests', () => {
    let supportAgent;
    let supportAgentRepository;

    before(async () => {
        const supportAgentEntity = new SupportAgent();
        supportAgentEntity.firstName = 'Nikola';
        supportAgentEntity.lastName = 'Tesla';
        supportAgentRepository = await getRepository(SupportAgent);
        supportAgent = await supportAgentRepository.save(supportAgentEntity);
    });

    it('Issue should be resolved, and Support Agent should be available', async () => {
        const unresolvedIssue: Issue = await reportNewIssue();

        const { body: response } = await request.patch(`/issues/${unresolvedIssue.id}`)
            .expect(200);

        expect(response.status).to.equals(IssueStatus.RESOLVED);

        const supportAgentAfterIssue = await supportAgentRepository.findOne({ where: { id: supportAgent.id } });
        expect(supportAgentAfterIssue.available).to.equals(true);
    });

    it('Issue should be resolved, and Support Agent should be assigned to next unresolved issue', async () => {
        const firstUnresolvedIssue: Issue = await reportNewIssue();
        const secondUnresolvedIssue: Issue = await reportNewIssue();

        const { body: response } = await request.patch(`/issues/${firstUnresolvedIssue.id}`)
            .expect(200);

        expect(response.status).to.equals(IssueStatus.RESOLVED);

        const supportAgentAfterIssue = await supportAgentRepository.findOne({ where: { id: supportAgent.id } });
        expect(supportAgentAfterIssue.available).to.equals(false);

        const [assignedIssue] = await getRepository(AssignedIssue).find({ supportAgentId: supportAgent.id });
        expect(assignedIssue.issueId).to.equals(secondUnresolvedIssue.id);
        expect(assignedIssue.supportAgentId).to.equals(supportAgent.id);

        await getRepository(AssignedIssue).delete({ issueId: secondUnresolvedIssue.id });
        await getRepository(Issue).delete({ id: secondUnresolvedIssue.id });
    });
});