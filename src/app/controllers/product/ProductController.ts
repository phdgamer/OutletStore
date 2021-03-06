import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Product from '../../models/Product';
import returnUserIdFromToken from '../../middleware/disruptTokenMiddleware';
import ProductInputStock from '../../models/ProductInputStock';

export default {
  async show(request: Request, response: Response) {
    const productRepository = getRepository(Product);

    const products = await productRepository.find({ where: [{ active: '1' }] });

    return response.status(200).json(products);
  },
  async index(request: Request, response: Response) {
    const { barCode } = request.params;
    const productRepository = getRepository(ProductInputStock);

    const { product } = await productRepository.findOneOrFail({ where: [{ product_bar_code: barCode }], relations: ['product'] });

    return response.status(200).json({ productName: product.name });
  },
  async create(request: Request, response: Response) {
    const productRepository = getRepository(Product);
    const { name, productBrandId, productProviders, productSubCategoryId } = request.body;

    const { authorization } = request.headers;

    const userId = returnUserIdFromToken(authorization);

    const productExists = await productRepository.findOne({ where: [{ name, active: '1' }] });

    if (productExists) {
      return response.sendStatus(400);
    }

    try {
      const product = productRepository.create({
        name,
        user: userId,
        productBrand: productBrandId,
        productProviderProducts: productProviders,
        productSubCategory: productSubCategoryId
      });

      await productRepository.save(product);

      return response.status(201).json(product);
    } catch (error) {
      console.error(error);
      return response.sendStatus(500);
    }
  }
};
