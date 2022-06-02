import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';
import { scryptSync } from 'crypto';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  public password: string;

  @Column()
  public email: string;

  @Exclude()
  @Column()
  public salt: string;

  @Column({ default: false })
  public isConfirm: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = scryptSync(password, this.salt, 32).toString('hex');
    return hash === this.password;
  }
}
