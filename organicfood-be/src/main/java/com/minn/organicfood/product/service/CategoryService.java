package com.minn.organicfood.product.service;

import com.minn.organicfood.product.domain.Category;
import com.minn.organicfood.product.dto.response.CategoryNodeResponse;
import com.minn.organicfood.product.repository.CategoryRepository;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.http.util.TextUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryNodeResponse> getAll() {
        List<Category> all = categoryRepository.findAll();
        Map<Long, List<Category>> childrenByParent = groupByParent(all);

        return all.stream()
                .filter(c -> c.getParentId() == null)
                .sorted(Comparator.comparingInt(c ->
                        c.getDisplayOrder() == 0
                                ? Integer.MAX_VALUE
                                : c.getDisplayOrder()
                ))
                .map(root -> buildNode(root, childrenByParent))
                .toList();
    }

    public CategoryNodeResponse getCategoryTree(Long id, String keyword, String slug) {
        boolean hasId = id != null;
        boolean hasKeyword = !TextUtils.isBlank(keyword);
        boolean hasSlug = !TextUtils.isBlank(slug);

        int count = (hasId ? 1 : 0)
                + (hasKeyword ? 1 : 0)
                + (hasSlug ? 1 : 0);

        if (count != 1) {
            throw BusinessException.of(ErrorCode.INVALID_REQUEST)
                    .withDetail("Exactly one of 'id', 'keyword', or 'slug' must be provided");
        }

        List<Category> all = categoryRepository.findAll();
        Map<Long, Category> byId = all.stream()
                .collect(Collectors.toMap(Category::getId, c -> c));
        Map<Long, List<Category>> childrenByParent = groupByParent(all);

        Category anchor = null;

        if (hasKeyword) {
            anchor = findByKeyword(all, keyword);
        } else if (hasSlug) {
            anchor = findBySlug(all, slug);
        } else {
            anchor = byId.get(id);
        }

        Category root = findRoot(anchor, byId);
        return buildNode(root, childrenByParent);
    }

    private Category findBySlug(List<Category> all, String slug) {
        String needle = slug.trim();
        return all.stream()
                .filter(c -> c.getSlug().equalsIgnoreCase(needle))
                .findFirst()
                .orElseThrow(() -> BusinessException.of(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private Category findByKeyword(List<Category> all, String keyword) {
        String needle = keyword.trim().toLowerCase();
        return all.stream()
                .filter(c -> c.getName().toLowerCase().contains(needle))
                .min(Comparator
                        .comparing((Category c) -> !c.getName().equalsIgnoreCase(needle))
                        .thenComparingInt(c -> c.getName().length()))
                .orElseThrow(() -> BusinessException.of(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private Category findRoot(Category node, Map<Long, Category> byId) {
        Category current = node;
        while (current.getParentId() != null) {
            Category parent = byId.get(current.getParentId());
            if (parent == null) {
                break;
            }
            current = parent;
        }
        return current;
    }

    private Map<Long, List<Category>> groupByParent(List<Category> all) {
        return all.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Category::getParentId));
    }

    private CategoryNodeResponse buildNode(Category entity, Map<Long, List<Category>> childrenByParent) {
        List<CategoryNodeResponse> children = childrenByParent
                .getOrDefault(entity.getId(), List.of())
                .stream()
                .sorted(Comparator.comparingInt(Category::getDisplayOrder))
                .map(child -> buildNode(child, childrenByParent))
                .toList();
        return new CategoryNodeResponse(entity.getId(), entity.getName(), entity.getSlug(), entity.getImageUrl(), children);
    }
}
