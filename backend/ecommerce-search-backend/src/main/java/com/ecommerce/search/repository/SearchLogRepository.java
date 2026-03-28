package com.ecommerce.search.repository;

import com.ecommerce.search.model.SearchLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchLogRepository extends JpaRepository<SearchLog, Long> {

    @Query(value = "SELECT sl.query, COUNT(*) as cnt FROM search_logs sl " +
                   "WHERE sl.query IS NOT NULL AND sl.query != '' " +
                   "GROUP BY sl.query ORDER BY cnt DESC LIMIT 10",
           nativeQuery = true)
    List<Object[]> findTopQueries();
}
