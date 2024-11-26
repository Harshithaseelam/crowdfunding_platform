// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdfundingPlatform {
    struct Project {
        address payable owner;
        string title;
        string description;
        uint256 fundingGoal;
        uint256 totalFunded;
        uint256 deadline;
        bool isCompleted;
        Milestone[] milestones;
    }
    

  struct Milestone {
    string description;
    uint256 amount;
    bool isApproved;
    uint256 votesYes;
    uint256 votesNo;
}
    mapping(uint256 => mapping(address => bool)) public hasVoted;



    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(uint256 projectId, address owner, uint256 fundingGoal);
    event ContributionMade(uint256 projectId, address contributor, uint256 amount);

   function createProject(
    string memory _title,
    string memory _description,
    uint256 _fundingGoal,
    uint256 _deadline,
    string[] memory milestoneDescriptions,
    uint256[] memory milestoneAmounts
) public {
    require(milestoneDescriptions.length == milestoneAmounts.length, "Mismatch in milestone data");
    
    Project storage newProject = projects[projectCount];
    newProject.owner = payable(msg.sender);
    newProject.title = _title;
    newProject.description = _description;
    newProject.fundingGoal = _fundingGoal;
    newProject.deadline = _deadline;
    newProject.isCompleted = false;

    for (uint256 i = 0; i < milestoneDescriptions.length; i++) {
        newProject.milestones.push(Milestone({
            description: milestoneDescriptions[i],
            amount: milestoneAmounts[i],
            isApproved: false,
            votesYes: 0,
            votesNo: 0
        }));
    }

    projectCount++;
    emit ProjectCreated(projectCount - 1, msg.sender, _fundingGoal);
}


   function contribute(uint256 _projectId) public payable {
    Project storage project = projects[_projectId];
    require(block.timestamp < project.deadline, "Deadline has passed");
    require(msg.value > 0, "Contribution must be greater than 0");
    require(project.totalFunded < project.fundingGoal, "Funding goal already met");

    project.totalFunded += msg.value;

    emit ContributionMade(_projectId, msg.sender, msg.value);
}


    function voteOnMilestone(uint256 _projectId, uint256 _milestoneId, bool _approve) public {
    Project storage project = projects[_projectId];
    require(project.totalFunded > 0, "No contributions made yet");
    require(!hasVoted[_projectId][msg.sender], "Already voted");

    hasVoted[_projectId][msg.sender] = true;

    Milestone storage milestone = project.milestones[_milestoneId];
    if (_approve) {
        milestone.votesYes++;
    } else {
        milestone.votesNo++;
    }
}


function releaseFunds(uint256 _projectId, uint256 _milestoneId) public {
    Project storage project = projects[_projectId];
    require(msg.sender == project.owner, "Only the project owner can release funds");
    require(_milestoneId < project.milestones.length, "Invalid milestone ID");

    Milestone storage milestone = project.milestones[_milestoneId];
    require(milestone.isApproved == false, "Funds already released for this milestone");
    require(milestone.votesYes > milestone.votesNo, "Milestone not approved by backers");

    uint256 amount = milestone.amount;
    require(project.totalFunded >= amount, "Insufficient funds");

    milestone.isApproved = true;
    project.totalFunded -= amount;
    project.owner.transfer(amount);
}

}
