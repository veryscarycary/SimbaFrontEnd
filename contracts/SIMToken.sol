pragma solidity ^0.4.15; //We have to specify what version of compiler this code will use

import './ERC20Token.sol';
import './SafeMath.sol';

contract SIMToken is ERC20Token {
  using SafeMath for uint256;

  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) allowed;
  uint256 public totalSupply;

  /* Public variables of the token */
  string public name;                   //fancy name: eg Simon Bucks
  uint8 public decimals;                //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
  string public symbol;                 //An identifier: eg SBX
  string public version = 'H1.0';       //human 0.1 standard. Just an arbitrary versioning scheme.

  address public owner;

  // CrowdSales States
  // 1 ETH = 500 SIM
  uint256 public constant RATE = 500;

  function SIMToken() {
      balances[msg.sender] = 100000000000; // Give the creator all initial tokens (100000 for example)
      totalSupply = 100000000;  // Update total supply (100000 for example)
      name = "SIMBA";  // Set the name for display purposes
      decimals = 3; // Amount of decimals for display purposes
      symbol = "SIM"; // Set the symbol for display purposes
  }

  function () payable {
    // if ether is sent to this address, send it back.
    throw;
  }

  function createTokens() payable {
    require(msg.value > 0);

    uint256 tokens = msg.value.mul(RATE);
    balances[msg.sender] = balances[msg.sender].add(tokens);

    totalSupply = totalSupply.add(tokens);

    // Transfer ETH to owner wallet
    // If this fails, it will rollback everything above
    owner.transfer(msg.value);
  }

  function transfer(address _to, uint256 _value) returns (bool success) {
    require(
      balances[msg.sender] >= _value
      && _value > 0
    );
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
    require(
      balances[_from] >= _value
      && allowed[_from][msg.sender] >= _value
      && _value > 0
    );
    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    Transfer(_from, _to, _value);
    return true;

  }

  function balanceOf(address _owner) constant returns (uint256 balance) {
    return balances[_owner];
  }

  function approve(address _spender, uint256 _value) returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

  // /* Approves and then calls the receiving contract */
  // function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
  //     allowed[msg.sender][_spender] = _value;
  //     Approval(msg.sender, _spender, _value);

  //     //call the receiveApproval function on the contract you want to be notified. This crafts the function signature manually so one doesn't have to include a contract in here just for this.
  //     //receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
  //     //it is assumed that when does this that the call *should* succeed, otherwise one would use vanilla approve instead.
  //     if (!_spender.call(bytes4(bytes32(sha3("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData)) {
  //       throw;
  //     }
  //     return true;
  // }
}
