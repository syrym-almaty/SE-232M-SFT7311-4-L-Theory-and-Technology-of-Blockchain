// test/Marketplace.test.js
const Marketplace = artifacts.require('Marketplace');

contract('Marketplace', (accounts) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  it('should list an item', async () => {
    await marketplace.listItem('Item 1', 'Description 1', web3.utils.toWei('1', 'Ether'), { from: accounts[0] });
    const item = await marketplace.items(1);
    assert.equal(item.name, 'Item 1', 'Item name is correct');
  });

  it('should purchase an item', async () => {
    const initialSellerBalance = await web3.eth.getBalance(accounts[0]);
    await marketplace.purchaseItem(1, { from: accounts[1], value: web3.utils.toWei('1', 'Ether') });
    const item = await marketplace.items(1);
    assert.equal(item.sold, true, 'Item is marked as sold');
  });

  it('should add a review', async () => {
    await marketplace.addReview(1, 5, 'Great product!', { from: accounts[1] });
    const reviews = await marketplace.getReviews(1);
    assert.equal(reviews.length, 1, 'Review count is correct');
  });
});