# Software architecture

Updated 01-06-2021

## Repository organization
##### Client (JS)
/client/src
Game state and DTO: /client/src/ElDorado/GameState
Game phases (CreateGame, ShowGame etc.): /client/src/ElDorado/GamePhases
Images used to display the game: /client/public

##### API (Java)
/lib/src/main/java/eldorado/api
API DTOs: /lib/src/main/java/eldorado/api/dto

Tests:
/lib/src/test/java/eldorado/api

##### Domain (Java)
/lib/src/main/java/eldorado/domain
Map configurations are hardcoded in: /lib/src/main/java/eldorado/domain/MapConfiguration

Tests:
/lib/src/test/java/eldorado/domain

## Main code flow
##### Client connects and gets to see the game map - sequence diagram
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Domain
    activate Client
    Note over Client: Browser requests<br>http://localhost:3000
    Note over Client: No instance of GameState, so /CreateGame is rendered
    Client->>API: Request a new game by GET eldorado/api/creategame
    activate API
    Note over API: Create new session
    API->>Domain: Create new Game instance
    activate Domain
    Domain->>API: Game instance
    deactivate Domain
    Note over API: Set Game as session attribute
    Note over API: Creates GameStateDTO instance based on Game
    API->>Client: Response containing GameStateDTO
    deactivate API
    Note over Client: /CreateGame creates GameState instance based on received GameStateDTO
    Note over Client: Instance of GameState exists, so /ShowGame is rendered
    Note over Client: /ShowGame renders an HTML table of the map based on the MapState contained in the GameState,<br>containing a button for each field for which the onClick event is handled to fieldButtonClicked()
    deactivate Client
```
##### Client moves the pawn by performing a VALID move - sequence diagram
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Domain
    activate Client
    Note over Client: Client views /ShowGame, selects a card,<br>clicks on a field<br>and fieldButtonClicked() is called
    Note over Client: movePawnToField() is called
    Client->>API: Request move by POST eldorado/api/movepawn<br>containing the selected card<br> and the coordinates of the field that was clicked
    activate API
    API->>Domain: Asks if the requested move is a valid move<br>in regard of the current position of the pawn<br>and the selected card
    activate Domain
    Domain->>API: Returns that the move is VALID
    deactivate Domain
    API->>Domain: Instructs the game to process the valid move
    activate Domain
    deactivate Domain
    Note over API: Creates GameStateDTO instance based on Game
    API->>Client: Responds status 200 and body containing new GameStateDTO
    deactivate API
    Note over Client: /ShowGame updates the clientside GameState based on the received GameStateDTO
    deactivate Client
```
##### Client moves the pawn by performing an INVALID move - sequence diagram
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Domain
    activate Client
    Note over Client: Client views /ShowGame, selects a card,<br>clicks on a field<br>and fieldButtonClicked() is called
    Note over Client: movePawnToField() is called
    Client->>API: Request move by POST eldorado/api/movepawn<br>containing the selected card<br> and the coordinates of the field that was clicked
    activate API
    API->>Domain: Asks if the requested move is a valid move<br>in regard of the current position of the pawn<br>and the selected card
    activate Domain
    Domain->>API: Returns that the move is INVALID
    deactivate Domain
    Note over API: Creates DeniedRequestDTO instance<br>based on the reason why the move was invalid
    API->>Client: Responds status 202 and body containing the DeniedRequestDTO
    deactivate API
    Note over Client: /ShowGame shows an alert containing the text from the DeniedRequestDTO
    deactivate Client
```
##### Client pages flow
```mermaid
graph TD;
	Browser-->index;
	index-->App;
	App-->ElDorado;
	ElDorado-->CreateGame;
	CreateGame-->ElDorado;	
	ElDorado-->ShowGame;
	ShowGame-->ElDorado
	ElDorado-->App;
	App-->index;
	index-->Browser;
```
## Client class diagram
```mermaid
classDiagram
	GameStateDTO *-- MapStateDTO : One
	GameStateDTO *-- DeckStateDTO : One
	GameStateDTO : number winningPawnId
	GameStateDTO : MapStateDTO mapStateDTO
	MapStateDTO *-- FieldDTO : Many
	MapStateDTO : FieldDTO[] fieldDTOs
	MapStateDTO : string separator
	MapStateDTO : [] fieldTypes
	FieldDTO : number x
	FieldDTO : number y
	FieldDTO : number z
	FieldDTO : number occupiedByPawnId
	FieldDTO : string type
	DeckStateDTO : number deckAmountLeft
	DeckStateDTO : string[] hand
	DeckStateDTO : number discardedAmount
	GameState *-- MapState : One
	GameState *-- DeckState : One
	GameState : MapState mapState
	GameState : number winningPawnId
	GameState : int winner
	MapState *-- Field : Many
	MapState : {} fields
	MapState : string separator
	MapState : [] fieldTypes
	MapState : createFieldsArray()
	Field *-- Coordinates : One
	Field : number occupiedByPawnId
	Field : Coordinates coordinates
	Field : string type
	Coordinates : number x
	Coordinates : number y
	Coordinates : number z
	Coordinates : string rowColumnStringKey
	Coordinates : string xyzStringKey
	Coordinates : number rowId
	Coordinates : number columnId
	DeckState : number deckAmountLeft
	DeckState : string[] hand
	DeckState : string[] selectedCards
	DeckState : number discardedAmount
	DeckState : isOneCardSelected()
	DeckState : areMultipleCardsSelected()
	DeckState : addCardToSelection()
	DeckState : removeCardFromSelection()
	class MapBoundaries
	MapBoundaries : update()
	MapBoundaries : number firstRowId
	MapBoundaries : number lastRowId
	MapBoundaries : number firstColumnId
	MapBoundaries : number lastColumnId
	class MovePawnRequestDTO
	MovePawnRequestDTO : number pawnId
	MovePawnRequestDTO : number x
	MovePawnRequestDTO : number y
	MovePawnRequestDTO : number z
	MovePawnRequestDTO : string[] selectedCards
	class DeniedRequestDTO
	DeniedRequestDTO : string message
```
## API class diagram
##### eldorado.api
```mermaid
classDiagram
	CreateGame <-- HttpServletRequest
	Game <--> CreateGame
	GameState <--> CreateGame
	CreateGame : initialize()
```
```mermaid
classDiagram
	HttpServletRequest --> MovePawn : receives
	MovePawnRequestDTO --> MovePawn : receives
	Game <--> MovePawn
	GameState <--> MovePawn
	MovePawn <--> DeniedRequestDTO
	MovePawn : initialize()
	MovePawn : getErrorMessageForMovePawnRequestSituation()
```
##### eldorado.api.dto
```mermaid
classDiagram
	GameStateDTO *-- MapStateDTO : One
	GameStateDTO *-- DeckStateDTO : One
	GameStateDTO : MapStateDTO mapStateDTO
	GameStateDTO : int winningPawnId
	MapStateDTO *-- FieldDTO : Many
	MapStateDTO : FieldDTO[] fieldDTOs
	MapStateDTO : String separator
	MapStateDTO : String[] fieldTypes
	MapStateDTO : convertMapToJSONableArrayDTO()
	FieldDTO : int x
	FieldDTO : int y
	FieldDTO : int z
	FieldDTO <|-- Field : extends
	DeckStateDTO : int deckAmountLeft
	DeckStateDTO : String[] hand
	DeckStateDTO : int discardedAmount
	Field : int occupiedByPawnId
	Field : String type
	class DeniedRequestDTO
	DeniedRequestDTO : String message
	class MovePawnRequestDTO
	MovePawnRequestDTO : int pawnId
	MovePawnRequestDTO : int x
	MovePawnRequestDTO : int y
	MovePawnRequestDTO : int z
	MovePawnRequestDTO : String[] selectedCards
```
## Domain class diagrams
##### eldorado.domain
```mermaid
classDiagram
	Game *-- MapConfiguration : One
	Game *-- Deck : One
	Game : MapConfiguration map
	Game : int winningPawnId
	Game : getMap()
	Game : canPawnMoveFromFieldToField()
	Game : processPossibleWin()
	Game : setWinningPawnId()
	Game : getWinningPawnId()
	MapConfiguration *-- Field : Many
	MapConfiguration : Map<String,Field> fields
	MapConfiguration : String[] fieldTypes
	MapConfiguration : String separator
	MapConfiguration : String[][][] mapConfigurations
	MapConfiguration : int[][] neighborCoordinatesOffsets
	MapConfiguration : createMapFromMapConfiguration()
	MapConfiguration : isField()
	MapConfiguration : getField()
	MapConfiguration : getNeighborCoordinatesOffsets()
	MapConfiguration : findNeighboringFieldThatCurrentlyContainsPawn()
	MapConfiguration : xyzToStringKey()
	Field : int occupiedByPawnId
	Field : String type
	Field : setOccupiedByPawnId()
	Field : isOccupied()
	Field : getPawnId()
	Field : obtainPawn()
	Field : receivePawn()
	Deck : ArrayList<String> deck
	Deck : ArrayList<String> hand
	Deck : ArrayList<String> discarded
	Deck : int maxCardsInHand
```