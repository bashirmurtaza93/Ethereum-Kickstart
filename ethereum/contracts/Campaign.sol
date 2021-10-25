// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.6;

contract CampaignFactory{
    
    Campaign[] public deployedCampaigns; 
    
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);      
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (Campaign[] memory){
        return deployedCampaigns;
    }
    
    
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete; 
        uint approvalCount; 
        mapping (address => bool) approvals;
    }
    
    
    mapping (uint => Request) public requests;    
    address public manager;
    uint public minimumContribution;
    uint public numRequests;
    uint public approversCount;
    address public currentAddress; 
    mapping(address => bool) public approvers; 
    
    
    modifier restricted(){
      require(msg.sender == manager);
      _;
    }
    
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        currentAddress = msg.sender;
        approvers[msg.sender] = true; 
        
        approversCount++;
    }
    
    function createRequest(string calldata description, uint value, address payable recipient) public restricted {
         
          Request storage newRequest = requests[numRequests];
           numRequests++;
           newRequest.description = description;
           newRequest.value = value;
           newRequest.recipient = recipient;
           newRequest.complete = false;
           newRequest.approvalCount = 0;
           
        
    }
    
    function approveRequest(uint index) public {
        
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
    }
    
    function finalizeRequest(uint index) public restricted {
        
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
        
        
    }
    
    
    function getSummary() public view returns(uint,uint,uint,uint,address){
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager);
    }
    
    
    function getRequestCount() public view returns(uint){
        return numRequests;
    }


    
}
       
