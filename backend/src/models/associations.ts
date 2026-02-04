
import User from './User';
import Sale from './Sale';
import Item from './Item';
import Payment from './Payment';

export const setupAssociations = () => {
    User.hasMany(Sale, { foreignKey: 'userId', as: 'sales' });
    Sale.belongsTo(User, { foreignKey: 'userId', as: 'vendedor' });

    Sale.hasMany(Payment, { foreignKey: 'saleId', as: 'pagamentos' });
    Payment.belongsTo(Sale, { foreignKey: 'saleId', as: 'venda' });

    Sale.belongsToMany(Item, {
        through: 'venda_item',
        foreignKey: 'venda_id',
        otherKey: 'item_id',
        as: 'itens'
    });
    Item.belongsToMany(Sale, {
        through: 'venda_item',
        foreignKey: 'item_id',
        otherKey: 'venda_id',
        as: 'vendas'
    });
};

export { User, Sale, Item, Payment };