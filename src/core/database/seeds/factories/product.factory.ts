import { setSeederFactory } from 'typeorm-extension';
import { Product } from 'src/domain/product/entities/product.entity';

export const ProductFactory = setSeederFactory(Product, (faker) => {
    const product = new Product();
    product.name = faker.commerce.productName();
    product.description = faker.commerce.productDescription();
    product.price = parseFloat(faker.commerce.price());
    return product;
});
