# Software architecture

## Main code flow
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Domain
```

## Class diagrams per package


##### eldorado.domain
```mermaid
classDiagram
	Game : MapConfiguration map
	Game : int winningPawnId
	Game : getMap()
	Game : processPossibleWin()
	Game : setWinningPawnId()
	Game : getWinningPawnId()
	Game <|-- MapConfiguration : One
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
	MapConfiguration <|-- Field : Many
	Field : int occupiedByPawnId
	Field : String type
	Field : setOccupiedByPawnId()
	Field : isOccupied()
	Field : getPawnId()
	Field : obtainPawn()
	Field : receivePawn()
```
##### eldorado.domain.dto
```mermaid
classDiagram
	GameStateDTO : MapStateDTO mapStateDTO
	GameStateDTO : int winningPawnId
	GameStateDTO <|-- MapStateDTO : One
	MapStateDTO : FieldDTO[] fieldDTOs
	MapStateDTO : String separator
	MapStateDTO : String[] fieldTypes
	MapStateDTO : convertMapToJSONableArrayDTO()
	MapStateDTO <|-- FieldDTO : Many
	FieldDTO : int x
	FieldDTO : int y
	FieldDTO : int z
	FieldDTO o- Field
```