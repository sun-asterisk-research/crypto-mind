pragma solidity ^0.5.0;

import "./AccessControl.sol";

contract Game is AccessControl {
    uint public bounty;
    address payable[] public winners;

    address payable[] public players;
    mapping (address=>uint) public winCount;

    mapping (uint => mapping(address => bytes32)) public questionAnswer; // lưu câu trả lời của các địa chỉ ở mỗi câu hỏi
    mapping (uint => address payable[]) public questionPlayer; // lưu mảng những địa chỉ trả lời trong mỗi câu hỏi
    mapping (uint => bool) public asked; // check xem CEO đã đưa ra câu hỏi hay chưa
    mapping (uint => address payable[]) public questionWinner; // lưu những địa chỉ trả lời đúng ở mỗi câu hỏi

    bytes32[10] private correctAnswer;
    uint8 public currentQuestion = 0;
    uint256 public questionBounty;
    uint public deadlineQuestion;

    event NewQuestion(uint8 currentQuestion);

    constructor(address payable _ceoAddress) public {
        ceoAddress = _ceoAddress;
    }

    modifier hasBounty() {
        require(bounty > 0, "Bounty must be > 0");
        _;
    }

    modifier beforeDeadline() {
        require(block.number <= deadlineQuestion,"Blocknumber <= Blocknumber + 5");
        _;
    }

    function setBounty()
        public
        payable
    {
        require(msg.value > 0, "Bounty must be > 0");
        bounty += msg.value;
    }

    function transferAlias(address payable playerAlias) external payable {
        uint value = msg.value;

        require(value > 0, "value must be > 0");
        require(playerAlias != address(0x0), "address must be != 0x0");
        playerAlias.transfer(value);
    }

    // check 1 address đã tồn tại trong 1 mảng hay chưa
    function containArray(address payable[] storage array, address element)
        internal
        view
        returns (bool)
    {
        bool found = false;
        for(uint8 i = 0; i < array.length; i++) {
            if(array[i] == element) {
                found = true;
                break;
            }
        }
        return found;
    }

    function setQuestion(bytes32 _correctAnswer)
        external
        onlyCeo
    {
        require(questionBounty == 0,"questionBounty == 0"); // tránh trường hợp người chơi đang chơi ceo đặt câu mới
        require(currentQuestion < 10,"Current question < 10");
        correctAnswer[currentQuestion] = _correctAnswer;
        asked[currentQuestion] = true;
        emit NewQuestion(currentQuestion);
        deadlineQuestion = block.number + 5;
    }

    function answer(bytes32 _answer)
        external
        beforeDeadline
        payable
    {
        require(asked[currentQuestion],"Only answered after the question has been created."); // chỉ được trả lời sau khi câu hỏi đã được đưa ra
        require(msg.sender != ceoAddress, "Player must be not Admin");
        require(msg.value > 2 * 10 ** 18, "fee must be > 2 TOMO");
        require(!containArray(questionPlayer[currentQuestion], msg.sender), "player has only one answer");
        questionBounty = safeAdd(questionBounty, msg.value);
        questionPlayer[currentQuestion].push(address(uint160(msg.sender)));
        questionAnswer[currentQuestion][msg.sender] = _answer;
        if(!containArray(players, msg.sender)) {
            players.push(msg.sender);
        }
    }

    function shareQuestionBounty()
        external
        onlyCeo
    {
        require(questionBounty > 0, "At least 1 answer");
        require(block.number > deadlineQuestion, "Sharing must be after deadline");
        require(currentQuestion < 10, "one round has only 10 question");

        for(uint i = 0; i < questionPlayer[currentQuestion].length; i++) {
            if(questionAnswer[currentQuestion][questionPlayer[currentQuestion][i]] == correctAnswer[currentQuestion]) {
                questionWinner[currentQuestion].push(questionPlayer[currentQuestion][i]);
                winCount[questionPlayer[currentQuestion][i]] ++;
            }
        }

        if(questionWinner[currentQuestion].length > 0) {
            uint bountySharing = questionBounty / questionWinner[currentQuestion].length;
            for(uint8 i = 0; i < questionWinner[currentQuestion].length; i++) {
                questionWinner[currentQuestion][i].transfer(bountySharing);
            }
            currentQuestion ++;
            questionBounty = 0;
        }
        else {
            currentQuestion = 10;
        }

        /*
            Muốn ăn được bounty thì ít nhất phải tham gia trả lời cả 10 câu hỏi
            => chỉ cần xét trong số những người tham gia ở câu cuối để tìm ra người có winCount = 10
        */
        if(currentQuestion >= 9) {
            for(uint8 i = 0; i < questionPlayer[9].length; i++) {
                if(winCount[questionPlayer[9][i]] == 10) {
                    winners.push(questionPlayer[9][i]);
                }
            }
        }
    }

    function shareBounty()
        external
        onlyCeo
        hasBounty
    {
        require(block.number > deadlineQuestion, "Sharing must be after deadline");
        require(currentQuestion > 9, "Sharing bounty must be after 10 question");

        if(winners.length > 0) {
            uint bountySharing = address(this).balance / winners.length;
            for(uint8 i = 0; i < winners.length; i++) {
                winners[i].transfer(bountySharing);
            }
        }
        else {
            ceoAddress.transfer(address(this).balance);
        }

        bounty = 0;
    }

    function safeAdd(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        require(c >= a,"After performing addition c is greater than a");
    }
    function safeSub(uint256 a, uint256 b) internal pure returns (uint256 c) {
        require(b <= a,"Before subtracting b must be less than a");
        c = a - b;
    }
    function safeMul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a * b;
        require(a == 0 || c / a == b,"a == 0 || c / a == b");
    }
    function safeDiv(uint256 a, uint256 b) internal pure returns (uint256 c) {
        require(b > 0,"When division b must be greater than 0");
        c = a / b;
    }

    function getAllPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getCorrectAddressByQuestion(uint questionIndex) public view returns (address payable[] memory) {
        return questionWinner[questionIndex];
    }
}
