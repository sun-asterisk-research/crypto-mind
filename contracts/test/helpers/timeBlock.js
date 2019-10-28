function minedBlock() {
  const id = Date.now();
  return new Promise((resolve) => {
    web3.currentProvider.send({ jsonrpc: '2.0', method: 'evm_mine', id: id }, resolve);
  });
}

async function mined(count) {
  for (let i = 0; i < count; i++) {
    await minedBlock();
  }
}
module.exports = {
  mined: mined
};
