package com.minn.organicfood.shared.infra;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.connection.zset.Aggregate;
import org.springframework.data.redis.connection.zset.Weights;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RedisService {

    RedisTemplate<String, Object> redisTemplate;

    public void set(String key, Object value, long timeout, TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    public <T> T get(String key, Class<T> clazz) {
        Object result = redisTemplate.opsForValue().get(key);
        return result != null ? clazz.cast(result) : null;
    }

    public <T> T getAndClear(String key, Class<T> clazz) {
        T result = get(key, clazz);
        if( result != null)
            delete(key);
        return result;
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }

    public boolean exists(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void hashSet(String key, String field, Object value) {
        redisTemplate.opsForHash().put(key, field, value);
    }

    public <T> T hashGet(String key, String field, Class<T> clazz) {
        Object result = redisTemplate.opsForHash().get(key, field);
        return result != null ? clazz.cast(result) : null;
    }

    public Map<Object, Object> hashGetAll(String hashKey) {
        return redisTemplate.opsForHash().entries(hashKey);
    }

    public void zAddAllWithZeroScore(String key, Collection<String> members) {
        if (members.isEmpty()) return;
        Set<ZSetOperations.TypedTuple<Object>> tuples = members.stream()
                .map(m -> ZSetOperations.TypedTuple.<Object>of(m, 0.0))
                .collect(Collectors.toSet());
        redisTemplate.opsForZSet().add(key, tuples);
    }

    public void zUnionAndStore(String destKey, String sourceKey, String maskKey, Weights weights) {
        redisTemplate.opsForZSet().unionAndStore(sourceKey, List.of(maskKey), destKey, Aggregate.MAX, weights);
    }

    public List<Object> zReverseRange(String key, long start, long end) {
        Set<Object> range = redisTemplate.opsForZSet().reverseRange(key, start, end);
        return range == null ? List.of() : new ArrayList<>(range);
    }

    public void expire(String key, long timeout, TimeUnit timeUnit) {
        redisTemplate.expire(key, timeout, timeUnit);
    }
}
