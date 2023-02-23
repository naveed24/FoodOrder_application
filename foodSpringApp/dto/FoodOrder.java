package com.food.foodSpringApp.dto;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import org.hibernate.annotations.CreationTimestamp;

@Entity
public class FoodOrder {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	@CreationTimestamp
	private LocalDate dateTime;
	private double totalCost;
	private String status;
	@OneToMany
	private List<Item> items;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public LocalDate getDateTime() {
		return dateTime;
	}
	public void setDateTime(LocalDate dateTime) {
		this.dateTime = dateTime;
	}
	public double getTotalCost() {
		return totalCost;
	}
	public void setTotalCost(double totalCost) {
		this.totalCost = totalCost;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public List<Item> getItems() {
		return items;
	}
	public void setItems(List<Item> items) {
		this.items = items;
	}
	@Override
	public String toString() {
		return "FoodOrder [id=" + id + ", dateTime=" + dateTime + ", totalCost=" + totalCost + ", status=" + status
				+ ", items=" + items + "]";
	}
	
	
	

}
