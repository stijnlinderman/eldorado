# Software architecture

## Main code flow

##### Clientside flow
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
##### Sequence diagram for a connecting client
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Domain
    activate Client
    Note over Client: Browser requests<br>http://localhost:3000
    Note over Client: No instance of GameState, so /CreateGame is rendered
    Client->>API: Request new GameState eldorado/api/creategame
    activate API
    Note over API: Create new session
    API->>Domain: Create new Game instance
    activate Domain
    Domain->>API: Game instance
    deactivate Domain
    Note over API: Set Game as session attribute
    API->>Domain: Create GameStateDTO instance based on Game
    activate Domain
    Domain->>API: GameStateDTO instance
    deactivate Domain
    API->>Client: Response containing GameStateDTO
    deactivate API
    Note over Client: /CreateGame creates GameState instance based on received GameStateDTO
    Note over Client: Instance of GameState exists, so /ShowGame is rendered
    Note over Client: /ShowGame creates DisplayableMap instance based on the GameState instance
    Note over Client: /ShowGame renders HTML table based on DisplayableMap containing a button on each field
    deactivate Client
```
##### Sequence diagram for a client that clicks on a field (button)
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Domain
    activate Client
    Note over Client: Client clicks on a button
    deactivate Client
```
## Class diagram client
```mermaid
classDiagram
	GameStateDTO *-- MapStateDTO : One
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
	GameState *-- MapState : One
	GameState : MapState mapState
	GameState : number winningPawnId
	GameState : int winner
	MapState *-- Field : Many
	MapState : {} fields
	MapState : string separator
	MapState : [] fieldTypes
	MapState : createFieldsArray()
	Field *-- Coordinates
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
	DisplayableMap <--> MapBoundaries : created and temporarily used during construction
	DisplayableMap : number[] rowIds
	DisplayableMap : number[] columnIds
	DisplayableMap : Field[][] fields
	DisplayableMap : boolean firstRowStartsOffset
	DisplayableMap : string separator
	DisplayableMap --> GameState : calls setGameState()
	DisplayableMap <-- MapState : receives
	DisplayableMap : getMapForDisplay()
	DisplayableMap : fieldButtonClicked()
	DisplayableMap : movePawnToField()
	MapBoundaries : update()
	MapBoundaries : number firstRowId
	MapBoundaries : number lastRowId
	MapBoundaries : number firstColumnId
	MapBoundaries : number lastColumnId
	DisplayableMap <--> MovePawnRequestDTO : Called as a result of movePawnToField()	
```
## Class diagram API
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
	Field : int occupiedByPawnId
	Field : String type
	class DeniedRequestDTO
	DeniedRequestDTO : String message
	class MovePawnRequestDTO
	MovePawnRequestDTO : int pawnId
	MovePawnRequestDTO : int x
	MovePawnRequestDTO : int y
	MovePawnRequestDTO : int z
```
## Class diagrams domain per package
##### eldorado.domain
```mermaid
classDiagram
	Game *-- MapConfiguration : One
	Game : MapConfiguration map
	Game : int winningPawnId
	Game : getMap()
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
```