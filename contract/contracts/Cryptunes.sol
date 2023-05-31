// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/*
Cryptunes empowers Digital Artists to create their NFTs and think of unlimited ways to create
different kind of NFT experiences.
*/

/** @title Cryptunes a modular NFT Collection Creator. */

contract Cryptunes is ERC1155
{
    address private owner;
    
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Collection{
        EnumerableSet.AddressSet collectionArtists;
        EnumerableSet.UintSet collectionTokens;
        uint256 collectionMaxSupply;
        uint256 collectionPool;
        address collectionAdmin;
        string groupID;
    }

    struct Token{
        string  metadataURL;
        string  space;
        address creator;
        uint256 maxCap;
        uint256 availableTokens;
        uint256 price;
    }

    Counters.Counter private tokenID;
    Counters.Counter private collectionID;

    mapping(string => Collection) private collectionINFO;
    mapping(uint256 => Token) private tokensInfo;
    mapping(uint256 => string) private collectionsID;   

  
    uint256 private collectionCreationPrice;
    uint256 private collectionsPool;

    constructor() ERC1155("") 
    {
        owner = msg.sender;
        collectionCreationPrice = 0 ether;
    }

    // Each digital artist must grap a unique collectionName to start minting NFTs on it
    // Is like creating a collection space for digital artists to mint their NFTs.
    function createCollection(string memory collectionName , string memory groupID, uint256 collectionTokensSupply ) public payable{
        require(collectionTokensSupply > 0);
        require(msg.value >= collectionCreationPrice);
        require(!collectionExists(collectionName));
        collectionID.increment();
        collectionsID[collectionID.current()] = collectionName;
        collectionINFO[collectionName].collectionAdmin = msg.sender;
        collectionINFO[collectionName].collectionArtists.add(msg.sender);
        collectionINFO[collectionName].groupID = groupID;
        collectionINFO[collectionName].collectionMaxSupply = collectionTokensSupply;
    }


    /// @notice defineNFT function 
    /// @dev retrieves the values for the NFT that is going to be Declared.
    /// the caller must be the collection Creator or a granted colleciton artist.
    function defineNFT(string memory metadataURL,string memory collectionName, uint256 mintPrice, uint256 maxSupply) public   {

        require(collectionINFO[collectionName].collectionArtists.contains(msg.sender));
        require(collectionINFO[collectionName].collectionMaxSupply > 0);

        collectionINFO[collectionName].collectionMaxSupply --;
        tokenID.increment();
        Token memory tokenINFO  = Token({ 
                                    metadataURL : metadataURL,
                                    space: collectionName,
                                    creator: msg.sender,
                                    maxCap: maxSupply,
                                    availableTokens: maxSupply,
                                    price: mintPrice
                                });
                                
        collectionINFO[collectionName].collectionTokens.add(tokenID.current());
        tokensInfo[tokenID.current()] = tokenINFO;
    }

    /// @notice Mint Function each address needs to have a 0 balance of that NFT tokenID to mint it
    // Also each NFT has a defined number of copies and a certain price defined by the creator of that tokenID in the declareNFT function
    function mint(uint256 tokenid) public payable {
        exists(tokenid);
        require(tokensInfo[tokenid].availableTokens > 0);
        require(tokensInfo[tokenid].price <= msg.value);
        require(balanceOf(msg.sender,tokenid) < 1);
        manageMintRoyalties(tokenid);
        _mint(msg.sender, tokenid, 1, "");
        tokensInfo[tokenid].availableTokens --;
    }

    function setTokenMintPrice(uint256 tokenid ,uint256 tokenPrice) public {
        onlyCreator(tokenid, msg.sender);
        tokensInfo[tokenid].price = tokenPrice;
    }
  
    /// @notice The spaceOwner can hire others to join their Space and add their artistic touch by declaring more NFTs 
    function addCollectionArtist(string memory collectionName, address artist) public {
        onlycollectionAdmin(collectionName,msg.sender);
        collectionINFO[collectionName].collectionArtists.add(artist);
    }

    /// @notice The spaceOwner can remove not well behaved artists from te space
    function deleteCollectionArtist(string memory collectionName, address artist) public {
        onlycollectionAdmin(collectionName,msg.sender);
        collectionINFO[collectionName].collectionArtists.remove(artist);
    }

    /// @notice Function to check if an address isArtist inside a certain space
    // Is used for custom Lit Actions to encrypt content that only the collectionArtists can decrypt!
    function isCollectionArtist(string memory collectionName, address sender ) public view returns (bool){
        return collectionINFO[collectionName].collectionArtists.contains(sender);
    }

    function getCollectionMaxCap(string memory collectionName) public view returns(uint256){
        return collectionINFO[collectionName].collectionTokens.length() + collectionINFO[collectionName].collectionMaxSupply;
    }

    function getcollectionTokens(string memory collectionName) public view returns(uint32[] memory){
        uint256 size = collectionINFO[collectionName].collectionTokens.length();
        uint32[] memory tokens = new uint32[](size);
        for (uint256 i = 0; i < size; i++) {
            tokens[i] = uint32(uint64(collectionINFO[collectionName].collectionTokens.at(i)));
        }
        return tokens;
    }

    function getcollectionINFO() public view returns(string[] memory, string[] memory){
        string[] memory collection = new string[](collectionID.current());
        string[] memory groupIDs = new string[](collectionID.current());

        for (uint256 i = 0; i < collectionID.current(); i++) {
            collection[i] = collectionsID[i+1];
            groupIDs[i] = collectionINFO[collectionsID[i+1]].groupID;
        }
        return (collection,groupIDs);
    }

    function getCollections() internal view returns(string[] memory){
        string[] memory collection = new string[](collectionID.current());

        for (uint256 i = 0; i < collectionID.current(); i++) {
            collection[i] = collectionsID[i+1];
        }
        return collection;
    }

    function getToken(uint256 tokenId) public view returns(Token memory){
        return tokensInfo[tokenId];
    }

    function isArtistForCollections(address artist) public view returns(string[] memory){
        string[] memory collection = getCollections();
        uint temp = 0;
        for (uint256 i=0; i < collection.length; i++){
            if(isCollectionArtist(collection[i], artist)){
                temp++;
            }
        }
        string[] memory returnArray = new string[](temp);
        uint256 j = 0;
        for (uint256 i=0; i < collection.length; i++){
            if(isCollectionArtist(collection[i], artist)){
                returnArray[j] = collection[i];
                j++;
            }
        }
        return returnArray;

    }

    /// @notice function to get if a collectionName is already exists
    function collectionExists(string memory collectionName)public view returns(bool){
        if(collectionINFO[collectionName].collectionAdmin == address(0)){
            return false;
        }
        return true;
    }


    /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
	function uri(uint256 tokenId) public view virtual override returns (string memory) {
		exists(tokenId);
		return tokensInfo[tokenId].metadataURL;
	}

    /// @notice returns the total number of minted NFTs
    function totalSupply() public view returns (uint256){
        return tokenID.current();
    }    

    /// @notice manageMintRoyalties Function gives 80% of the mint price to the tokenCreator
    // 10% to the collectionPool and 10% to the cryptunes contract 
    function manageMintRoyalties(uint256 tokenid) internal{
        address payable to = payable(tokensInfo[tokenid].creator);
        uint oneTenth = SafeMath.div(msg.value,10);
        collectionINFO[tokensInfo[tokenid].space].collectionPool = collectionINFO[tokensInfo[tokenid].space].collectionPool + oneTenth;
        collectionsPool = collectionsPool + oneTenth;
        to.transfer(SafeMath.mul(oneTenth,8));
    }

    /// @notice withdraw function of the contract funds only by the contract owner
    function withdraw() public payable  {
        ownerCheck(msg.sender);
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance - collectionsPool);
    }

    /// @notice collectionWithdraw function of the collection royalties only by the contract owner
    function collectionWithdraw(string memory collectionName) public payable{
        onlycollectionAdmin(collectionName, msg.sender);
        address payable to = payable(collectionINFO[collectionName].collectionAdmin);
        to.transfer(collectionINFO[collectionName].collectionPool);
        collectionsPool = collectionsPool - collectionINFO[collectionName].collectionPool;
    }

    function ownerCheck(address addr) internal view {
        if(owner!=addr){ revert(); }
    }

    function onlyCreator(uint256 tokenid, address sender) internal view {
        if(tokensInfo[tokenid].creator != sender){ revert(); }
    }

    function onlycollectionAdmin(string memory collectionName, address sender) internal view{
        if(collectionINFO[collectionName].collectionAdmin != sender){ revert(); }
    }

    function exists(uint256 tokenid) internal view{
        if(tokenid > tokenID.current()){ revert();}
    }


    function transferOwnership(address newOwner) public {
        ownerCheck(msg.sender);
        owner = newOwner;
    }

    function transferCollectionOwnership(address newCollectionOwner, string memory collectionName) public {
        onlycollectionAdmin(collectionName, msg.sender);
        collectionINFO[collectionName].collectionAdmin = newCollectionOwner;
    }
}

