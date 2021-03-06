let catchRevert = require("./exceptionsHelpers.js").catchRevert
var BlockchainSplitwise = artifacts.require("./BlockchainSplitwise.sol")


contract('BlockchainSplitwise', function(accounts) {

  const alice = accounts[0]
  const bob = accounts[1]
  const charlie = accounts[2]
  const david = accounts[3]
  const eve = accounts[4]
  const frank = accounts[5]
  const grace = accounts[6]
  

  beforeEach(async () => {
    instance = await BlockchainSplitwise.new()
    await instance.add_IOU(15, bob, 0, [], {from: alice})
    await instance.add_IOU(11, charlie, 0, [], {from: bob})
  })

  it('should correctly lookup the amount debtors owe the creditor', async () =>{
    const a_to_b_result = await instance.lookup(alice, bob)
    assert.equal(a_to_b_result, 15, 'Incorrect amount owed')
  })

  it('should correctly add additional amounts debtors owe the creditor', async () =>{
    await instance.add_IOU(3, bob, 0, [], {from: alice})
    const a_to_b_result = await instance.lookup(alice, bob)
    assert.equal(a_to_b_result, 18, 'Incorrect amount owed')
  })

  it('should correctly cancel a debt if a loop is created between two people', async () =>{
    await instance.add_IOU(15, alice, 1, [alice, bob], {from: bob})
    const a_to_b_result = await instance.lookup(alice, bob) 
    const b_to_a_result = await instance.lookup(bob, alice)
    assert.equal(a_to_b_result, 0, 'Incorrect amount owed')
  })

  it('should correctly cancel a debt if a loop is created between three people', async () =>{
    await instance.add_IOU(16, alice, 1, [alice, bob, charlie], {from: charlie})
    const a_to_b_result = await instance.lookup(alice, bob) 
    const b_to_c_result = await instance.lookup(bob, charlie) 
    const c_to_a_result = await instance.lookup(charlie, alice) 
    assert.equal(a_to_b_result, 4, 'Incorrect amount owed')
    assert.equal(b_to_c_result, 0, 'Incorrect amount owed')
    assert.equal(c_to_a_result, 5, 'Incorrect amount owed')
  })




})

