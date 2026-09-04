CREATE TABLE IF NOT EXISTS product.product_sale_period_counters (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id UUID NOT NULL,
    period_type VARCHAR(10) NOT NULL,   -- 'DAILY' / 'WEEKLY' / 'MONTHLY'
    period_key VARCHAR(20) NOT NULL,    -- '2026-08-21' / '2026-W34' / '2026-08'
    quantity_sold BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT fk_sale_period_counters_product FOREIGN KEY (product_id) REFERENCES product.products(id),
    CONSTRAINT uq_sale_period_counters_product_period UNIQUE (product_id, period_type, period_key)
);

-- Supports "top sellers for period_type=X, period_key=Y" without touching
-- product_id at all - the join in ProductSpecification filters by
-- (period_type, period_key) in the ON clause, so this is the index that
-- matters for the bestseller sort path.
CREATE INDEX IF NOT EXISTS idx_sale_period_counters_period
    ON product.product_sale_period_counters (period_type, period_key, quantity_sold DESC);