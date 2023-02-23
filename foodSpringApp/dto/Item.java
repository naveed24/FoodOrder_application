package com.food.foodSpringApp.dto;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.ManyToAny;

@Entity
public class Item {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private double cost;
	private String name;
	@ManyToOne
	private FoodOrder foodorder;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public double getCost() {
		return cost;
	}
	public void setCost(double cost) {
		this.cost = cost;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public FoodOrder getFoodorder() {
		return foodorder;
	}
	public void setFoodorder(FoodOrder foodorder) {
		this.foodorder = foodorder;
	}
	@Override
	public String toString() {
		return "Item [id=" + id + ", cost=" + cost + ", name=" + name + ", foodorder=" + foodorder + "]";
	}
	
	

}
