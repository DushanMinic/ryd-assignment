import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    Column,
} from 'typeorm';
import { Issue } from './issue.entity';
import { SupportAgent } from '../../supportAgent/entity/supportAgent.entity';

@Entity({ name: 'assignedIssues' })
export class AssignedIssue {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Issue, { nullable: false })
    @JoinColumn()
    issue: Issue;

    @OneToOne(() => SupportAgent, { nullable: false })
    @JoinColumn()
    supportAgent: SupportAgent;

    @Column()
    supportAgentId: string;

    @Column()
    issueId: string;
}
