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
* import java.util.Map
* import java.util.HashMap
```mermaid
classDiagram
	Game <|-- MapConfiguration : One
	MapConfiguration <|-- Field : Many
	Game : MapConfiguration map
	Game : int winningPawnId
	Game : getMap()
	Game : processPossibleWin()
	Game : setWinningPawnId()
	Game : getWinningPawnId()
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
##### eldorado.domain.dto
* import eldorado.domain.*
```mermaid
classDiagram
	GameStateDTO <|-- MapStateDTO : One
	GameStateDTO : MapStateDTO mapStateDTO
	GameStateDTO : int winningPawnId
	
```