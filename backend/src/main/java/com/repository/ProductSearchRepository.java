package com.repository;

import com.entity.ProductDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSearchRepository extends ElasticsearchRepository<ProductDocument, Long> {

    @org.springframework.data.elasticsearch.annotations.Query("{\"bool\": {\"should\": [{\"wildcard\": {\"name\": \"*?0*\"}}, {\"wildcard\": {\"description\": \"*?0*\"}}]}}")
    List<ProductDocument> findByNameContainingOrDescriptionContaining(String name, String description);

    // Find by category for recommendations
    List<ProductDocument> findByCategoryAndIdNot(String category, Long id);
}
