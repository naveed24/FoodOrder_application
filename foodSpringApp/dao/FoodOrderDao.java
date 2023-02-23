package com.food.foodSpringApp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.food.foodSpringApp.dto.FoodOrder;
import com.food.foodSpringApp.repository.FoodOrderRepo;
import com.food.foodSpringApp.repository.ItemRepo;

@Repository
public class FoodOrderDao {
	
	@Autowired
	FoodOrderRepo foodOrderRepo;
	@Autowired
	ItemRepo itemRepo;
	
	public FoodOrder saveFoodOrder(FoodOrder foodOrder)
	{
	  return foodOrderRepo.save(foodOrder);
	}
	public Optional<FoodOrder> getFoodOrderById(int id)
	{
	  return foodOrderRepo.findById(id);
	}
	public List<FoodOrder> getAllFoodOrder(){
		return foodOrderRepo.findAll();
	}
	public void deleteFoodOrder(int id) {
		foodOrderRepo.deleteById(id);
	}
	

}
