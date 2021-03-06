/* eslint-disable camelcase */
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, JoinColumn, ManyToOne
} from 'typeorm';

import ProductSell from './ProductSell';

@Entity('product_output_stock')
export default class ProductOutputStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  @Column('boolean', { nullable: false })
  active: boolean;

  @ManyToOne(() => ProductSell, productSell => productSell.productOutput)
  @JoinColumn({ name: 'product_sell_id' })
  productSellId:string
}
