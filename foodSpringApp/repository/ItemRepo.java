package com.food.foodSpringApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.food.foodSpringApp.dto.Item;

public interface ItemRepo extends JpaRepository<Item, Integer> {

}
