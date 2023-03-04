// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/*
CryptoStudio is builded to provide a completly dynamic NFT experience
Digital Artists can create their NFTs and think of unlimited ways to create
dynamic NFT experiences by leveraging tableland SQL utilities inside SmartContracts
*/

/** @title CryptoStudio a dynamic NFT Collection. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for minting your NFTs inside the Crypto Studio application
/// @dev A new Dynamic NFTContract that takes The benefits of pure SQL dynamic features
/// Tableland offers mutable Data with immutable access control only by the SmartContract
/// All the data inside the tables are pointing to an IPFS CID.

contract CrypTunes is ERC1155
{
    address private owner;
    
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct spaceInfo{
        EnumerableSet.AddressSet spaceArtists;
        EnumerableSet.UintSet spaceTokens;
        address spaceAdmin;
        string groupID;
    }

    struct tokenInfo{
        string metadataURL;
        address creator;
        uint256 maxCap;
        uint256 price;
    }

    Counters.Counter private tokenID;
    Counters.Counter private spaceID;

    mapping(string => spaceInfo) private spaceInfoMap;
    mapping(uint256 => tokenInfo) private tokenInfoMap;
    mapping(uint256 => string) private spacesMapping;   

  
    uint256 private spaceMintPrice;

    constructor() ERC1155("") 
    {

        owner = msg.sender;

        spaceMintPrice = 0.01 ether;


    }

    function socialSpaceCreation(string memory spaceName , string memory groupID ) public payable{
        require(msg.value >= spaceMintPrice);
        require(!spaceExists(spaceName));
        spaceID.increment();
        spacesMapping[spaceID.current()] = spaceName;
        spaceInfoMap[spaceName].spaceAdmin = msg.sender;
        spaceInfoMap[spaceName].spaceArtists.add(msg.sender);
        spaceInfoMap[spaceName].groupID = groupID;
    }

    /// @notice function to get if a spaceName is already exists
    function spaceExists(string memory spaceName)public view returns(bool){
        if(spaceInfoMap[spaceName].spaceAdmin == address(0)){
            return false;
        }
        return true;
    }


    function declareNFT(string memory metadataURL,string memory spaceName, uint256 mintPrice, uint256 maxSupply,uint256 current) public   {
        require(spaceInfoMap[spaceName].spaceArtists.contains(msg.sender));
        require(current == tokenID.current()+1);
        tokenID.increment();
        tokenInfo memory temp  = tokenInfo(metadataURL,msg.sender,maxSupply,mintPrice);
        spaceInfoMap[spaceName].spaceTokens.add(tokenID.current());
        tokenInfoMap[tokenID.current()] = temp;
    }

   
    function mint(uint256 tokenid) public payable {
        exists(tokenid);
        require(tokenInfoMap[tokenid].maxCap > 0);
        require(tokenInfoMap[tokenid].price <= msg.value);
        require(balanceOf(msg.sender,tokenid) < 1);
        address payable to = payable(tokenInfoMap[tokenid].creator);
        to.transfer(msg.value);
        // this.transfer(msg.value * 0.1);
        _mint(msg.sender, tokenid, 1, "");
        tokenInfoMap[tokenid].maxCap --;
    }

    function setTokenMintPrice(uint256 tokenid ,uint256 tokenPrice) public {
        onlyCreator(tokenid, msg.sender);
        tokenInfoMap[tokenid].price = tokenPrice;
    }

    function changeNFTMetadata(uint256 tokenid ,string memory metadata) interanal {
        onlyCreator(tokenid, msg.sender);
        tokenInfoMap[tokenid].metadataURL = metadata;
    }
  
    /// @notice The spaceOwner can hire others to join their Space and add their artistic touch by declaring more NFTs 
    function addSpaceArtist(string memory spaceName, address artist) public {
        onlySpaceAdmin(spaceName,msg.sender);
        spaceInfoMap[spaceName].spaceArtists.add(artist);
    }

    /// @notice The spaceOwner can remove not well behaved artists from te space
    function deleteSpaceArtist(string memory spaceName, address artist) public {
        onlySpaceAdmin(spaceName,msg.sender);
        spaceInfoMap[spaceName].spaceArtists.remove(artist);
    }

    /// @notice Function to check if an address isArtist inside a certain space
    // Is used for custom Lit Actions to encrypt content that only the spaceArtists can decrypt!
    function isSpaceArtist(string memory spaceName, address sender ) public view returns (bool){
        return spaceInfoMap[spaceName].spaceArtists.contains(sender);
    }

    /// @notice Function to check if an address isSpaceMember inside a certain space
    // Used for Lit Actions as the Encryption Rule for Posts-Proposal channels only granted to Space NFT holders , Artists and the space Admin
    function isSpaceMember(string memory spaceName, address sender) public view returns (bool){
        uint256 size = spaceInfoMap[spaceName].spaceTokens.length();
        uint256 index;
        if(isSpaceArtist(spaceName,sender)){
            return true;
        }
        for (uint256 i = 0; i < size; i++) {
            index = uint32(spaceInfoMap[spaceName].spaceTokens.at(i));
            if(balanceOf(sender,index) > 0){
                return true;
            }
        }
        return false;
    }

    function getSpaceTokens(string memory spaceName) public view returns(uint32[] memory){
        uint256 size = spaceInfoMap[spaceName].spaceTokens.length();
        uint32[] memory tokens = new uint32[](size);
        for (uint256 i = 0; i < size; i++) {
            tokens[i] = uint32(uint64(spaceInfoMap[spaceName].spaceTokens.at(i)));
        }
        return tokens;
    }

    function getSpaces() public view returns(string[] memory){
        string[] memory spaces = new string[](spaceID.current());
        for (uint256 i = 0; i < spaceID.current(); i++) {
            spaces[i] = spacesMapping[i];
        }
        return spaces;

    }


    /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
	function uri(uint256 tokenId) public view virtual override returns (string memory) {
		exists(tokenId);
		return tokenInfoMap[tokenId].metadataURL;
	}

    /// @notice returns the total number of minted NFTs
    function totalSupply() public view returns (uint256){
        return tokenID.current();
    }    

    /// @notice withdraw function of the contract funds only by the contract owner
    function withdraw() public payable  {
        ownerCheck(msg.sender);
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }

    function ownerCheck(address addr) internal view {
        if(owner!=addr){ revert(); }
    }

    function onlyCreator(uint256 tokenid, address sender) internal view {
        if(tokenInfoMap[tokenid].creator != sender){ revert(); }
    }

    function onlySpaceAdmin(string memory spaceName, address sender) internal view{
        if(spaceInfoMap[spaceName].spaceAdmin != sender){ revert(); }
    }

    function exists(uint256 tokenid) internal view{
        if(tokenid > tokenID.current()){ revert();}
    }


    function transferOwnership(address newOwner) public {
        ownerCheck(msg.sender);
        owner = newOwner;
    }
}