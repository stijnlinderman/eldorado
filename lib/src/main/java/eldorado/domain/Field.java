/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.domain;

public class Field {
	public int occupiedByPawnId = 0;
	public final String type;
	
	public Field (int startPosForPawnId, String type) {
		this.setOccupiedByPawnId(startPosForPawnId);
		this.type = type;
	}		
	
	public void setOccupiedByPawnId (int pawnId) {
		this.occupiedByPawnId = pawnId;
	}
	
	public boolean isOccupied () {
		return (this.occupiedByPawnId > 0);
	}
	
	public int getPawnId () {
		return this.occupiedByPawnId;
	}
	
	public int obtainPawn () {
		int pawnId = this.occupiedByPawnId;
		this.occupiedByPawnId = 0;
		return pawnId;
	}
	
	public void receivePawn (Field originField) {
		this.occupiedByPawnId = originField.obtainPawn();
	}
	
	public boolean doesSelectedCardsContainOnlyOneValidCard (String[] selectedCards) {
		if ((selectedCards.length == 1)
			&& ((this.type.equals(Type.jungle) && selectedCards[0].equals(Deck.CardType.explorer))
					|| (this.type.equals(Type.sea) && selectedCards[0].equals(Deck.CardType.sailor)) 
					|| (this.type.equals(Type.village) && selectedCards[0].equals(Deck.CardType.traveler))
					|| (this.type.equals(Type.eldorado)))
		) {
			return true;
		} else {
			return false;
		}
	}
	
	public class Type {
		public static final String jungle = "jungle";
		public static final String sea = "sea";
		public static final String village = "village";
		public static final String eldorado = "eldorado";
		public static final String mountain = "mountain";
	}
}