/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.domain;

public class Field {
	public int occupiedByPawnId = 0;
	
	public Field (int pawnId) {
		this.setOccupiedByPawnId(pawnId);
	}		
	
	public boolean isOccupied () {
		return (this.occupiedByPawnId > 0);
	}
	
	public int getPawnId () {
		return this.occupiedByPawnId;
	}
	
	public void setOccupiedByPawnId (int pawnId) {
		this.occupiedByPawnId = pawnId;
	}
	
	public void receivePawn (Field originField) {
		this.occupiedByPawnId = originField.obtainPawn();
	}
	
	public int obtainPawn () {
		int pawnId = this.occupiedByPawnId;
		this.occupiedByPawnId = 0;
		return pawnId;
	}
}