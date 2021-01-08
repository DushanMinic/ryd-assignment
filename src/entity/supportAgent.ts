import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'supportAgents' })
export class SupportAgent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 30 })
    firstName: string;

    @Column({ length: 30 })
    lastName: string;

    @Column({ default: false })
    available: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
