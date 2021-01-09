import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { IssueStatus } from '../modules/issue/enum/issueStatus.enum';

@Entity({ name: 'issues' })
export class Issue {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    title: string;

    @Column({ length: 500 })
    description: string;

    @Column({
        default: IssueStatus.UNRESOLVED,
        type: 'enum',
        enum: IssueStatus
    })
    status: IssueStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
