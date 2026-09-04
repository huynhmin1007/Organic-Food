CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS event_publication (
  id UUID NOT NULL PRIMARY KEY,
  completion_attempts INT DEFAULT NULL,
  completion_date TIMESTAMP(6) DEFAULT NULL,
  event_type VARCHAR(255) NOT NULL,
  last_resubmission_date TIMESTAMP(6) DEFAULT NULL,
  listener_id VARCHAR(255) NOT NULL,
  publication_date TIMESTAMP(6) NOT NULL,
  serialized_event TEXT NOT NULL,
  status VARCHAR(100) DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_event_publication_status_publication_date
  ON event_publication (status, publication_date);

CREATE TABLE IF NOT EXISTS event_consumptions (
    id UUID NOT NULL PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    consumer VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL DEFAULT 'PROCESSING',
    created_at TIMESTAMP(6) NOT NULL,
    completed_at TIMESTAMP(6),

    CONSTRAINT uk_event_consumptions UNIQUE (event_id, consumer)
);

CREATE TABLE IF NOT EXISTS assets (
    id UUID NOT NULL PRIMARY KEY,
    url TEXT NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    folder VARCHAR(50),
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_assets_public_id UNIQUE (public_id)
);

CREATE INDEX IF NOT EXISTS idx_assets_folder ON assets (folder);

CREATE SCHEMA IF NOT EXISTS identity;

CREATE TABLE IF NOT EXISTS identity.accounts (
    id UUID NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50),

    created_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP,
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(100),

    CONSTRAINT uk_accounts_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS identity.roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),

    created_at TIMESTAMP,
    created_by VARCHAR(100),

    CONSTRAINT uk_roles_name UNIQUE(name)
);


CREATE TABLE IF NOT EXISTS identity.permissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP,
    created_by VARCHAR(100),

    CONSTRAINT uk_permissions_name UNIQUE(name)
);


CREATE TABLE IF NOT EXISTS identity.account_roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id UUID NOT NULL,
    role_id BIGINT NOT NULL,

    granted_at TIMESTAMP,
    granted_by VARCHAR(100),

    CONSTRAINT fk_account_roles_account FOREIGN KEY (account_id) REFERENCES identity.accounts(id),
    CONSTRAINT fk_account_roles_role FOREIGN KEY (role_id) REFERENCES identity.roles(id),
    CONSTRAINT uk_account_roles UNIQUE (account_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_account_roles_account_id ON identity.account_roles (account_id);
CREATE INDEX IF NOT EXISTS idx_account_roles_role_id ON identity.account_roles (role_id);

CREATE TABLE IF NOT EXISTS identity.role_permissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,

    granted_at TIMESTAMP,
    granted_by VARCHAR(100),

    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES identity.roles(id),
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES identity.permissions(id),
    CONSTRAINT uk_role_permissions UNIQUE (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON identity.role_permissions (role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON identity.role_permissions (permission_id);

CREATE SCHEMA IF NOT EXISTS profile;

CREATE TABLE IF NOT EXISTS profile.user_profiles (
    id UUID NOT NULL PRIMARY KEY,
    account_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),

    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6),

    CONSTRAINT fk_user_profiles_account FOREIGN KEY (account_id) REFERENCES identity.accounts(id),
    CONSTRAINT uk_user_profiles_phone UNIQUE (phone),
    CONSTRAINT uk_user_profiles_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS profile.user_addresses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_profile_id UUID NOT NULL,
    address VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_user_addresses_user_profile FOREIGN KEY (user_profile_id) REFERENCES profile.user_profiles(id)
);

CREATE SCHEMA IF NOT EXISTS notification;

CREATE TABLE IF NOT EXISTS notification.notification_templates (
    id UUID NOT NULL PRIMARY KEY,
    code VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables JSONB,

    CONSTRAINT uk_notification_templates_code UNIQUE (code)
);


CREATE TABLE IF NOT EXISTS notification.notification_logs (
    id UUID NOT NULL PRIMARY KEY,
    template_code VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject TEXT,
    body TEXT,
    variables JSONB,
    status VARCHAR(100) NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMP(6) NULL,
    created_at TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification.notification_logs (status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient ON notification.notification_logs (recipient);

CREATE SCHEMA IF NOT EXISTS product;

CREATE TABLE IF NOT EXISTS product.categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_id BIGINT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    image_id UUID NULL,
    image_url TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6),

    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES product.categories(id),
--     CONSTRAINT fk_categories_image FOREIGN KEY (image_id) REFERENCES assets(id),
    CONSTRAINT uk_categories_slug UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON product.categories (parent_id);

CREATE TABLE IF NOT EXISTS product.brands (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    image_id UUID NULL,
    image_url TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,

--     CONSTRAINT fk_brands_image FOREIGN KEY (image_id) REFERENCES assets(id),
    CONSTRAINT uk_brands_slug UNIQUE (slug)
);

CREATE TABLE IF NOT EXISTS product.brand_categories (
    brand_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (brand_id, category_id),
    CONSTRAINT fk_brand_categories_brand FOREIGN KEY (brand_id) REFERENCES product.brands(id),
    CONSTRAINT fk_brand_categories_category FOREIGN KEY (category_id) REFERENCES product.categories(id)
);

CREATE INDEX IF NOT EXISTS idx_brand_categories_category_id ON product.brand_categories (category_id);

CREATE TABLE IF NOT EXISTS product.products (
    id UUID NOT NULL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    brand_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    thumbnail_id UUID NULL,
    thumbnail_url TEXT NULL,
    short_description TEXT,
    feature_specification TEXT,
    product_article TEXT,

    pack_quantity INT NOT NULL DEFAULT 1, -- số lượng: 1, 2, 5...
    pack_unit VARCHAR(30) NOT NULL, -- đơn vị: "thùng","lốc","hộp","vỉ","gói"
    pack_detail VARCHAR(255), -- text tự do: "48 hộp 180ml", "10 quả", "300g"

    price NUMERIC(12, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,

    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),

    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product.categories(id),
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES product.brands(id),
    CONSTRAINT uk_products_sku UNIQUE (sku),
    CONSTRAINT uk_products_slug UNIQUE (slug),
    CONSTRAINT ck_products_price CHECK (price > 0)
);

CREATE TABLE IF NOT EXISTS product.product_discounts (
    id UUID NOT NULL PRIMARY KEY,
    product_id UUID NOT NULL,
    discount_type VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL, -- 2 hộp trứng gà hộp 10 quả
    thumnail_id UUID NULL,
    thumbnail_url TEXT NULL,

    discount_percent NUMERIC(5, 2),
    fixed_price NUMERIC(12,2),
    buy_quantity INT,
    get_quantity INT,

    start_at TIMESTAMP(6) NOT NULL,
    end_at TIMESTAMP(6) NULL, -- có thể vô thời hạn
    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),

    CONSTRAINT fk_product_discounts_product FOREIGN KEY (product_id) REFERENCES product.products(id),
    CONSTRAINT ck_product_discounts_dates CHECK (end_at > start_at)
);

CREATE INDEX idx_discounts_active_lookup
    ON product.product_discounts (product_id, start_at, end_at)
    WHERE is_active = true;

CREATE TABLE IF NOT EXISTS product.product_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id UUID NOT NULL,
    asset_id UUID NULL,
    asset_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES product.products(id)
--     CONSTRAINT fk_product_images_asset FOREIGN KEY (asset_id) REFERENCES assets(id),
--     CONSTRAINT uk_product_images UNIQUE (product_id, asset_id)
);

CREATE TABLE IF NOT EXISTS product.stocks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id UUID NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    cost_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    supplier VARCHAR(255) NOT NULL,
    note TEXT,

    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    received_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stocks_in_product FOREIGN KEY (product_id) REFERENCES product.products(id),
    CONSTRAINT ck_stocks_in_quantity CHECK (quantity > 0),
    CONSTRAINT ck_stocks_in_cost CHECK (cost_price > 0)
);

CREATE INDEX IF NOT EXISTS idx_stock_in_product_id ON product.stocks (product_id);

CREATE SCHEMA IF NOT EXISTS ordering;

CREATE TABLE IF NOT EXISTS ordering.orders (
    id UUID NOT NULL PRIMARY KEY,
    customer_id UUID NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL DEFAULT 'PENDING',
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,

    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP(6),
    updated_by VARCHAR(100),

    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES identity.accounts(id),
    CONSTRAINT uk_orders_code UNIQUE (code),
    CONSTRAINT uk_orders_idempotency_key UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_orders_status
    ON ordering.orders (status);

CREATE INDEX IF NOT EXISTS idx_orders_created_at
    ON ordering.orders (created_at);

CREATE INDEX IF NOT EXISTS idx_orders_customer_status
    ON ordering.orders (customer_id, status);

CREATE TABLE IF NOT EXISTS ordering.order_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id UUID NOT NULL,

    product_id UUID NOT NULL,
    product_name VARCHAR(255) NOT NULL,  -- snapshot tên sp tại thời điểm mua
    product_sku VARCHAR(50) NOT NULL,    -- snapshot sku

    discount_id UUID NULL,              -- chỉ để truy vết/thống kê, KHÔNG dùng để tính lại giá
    discount_type VARCHAR(50),
    discount_label VARCHAR(255) NULL,    -- snapshot tên chương trình, nếu có áp dụng

    quantity INT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    free_quantity INT NOT NULL DEFAULT 0,
    line_total NUMERIC(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES ordering.orders(id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES product.products(id),
    CONSTRAINT fk_order_items_discount FOREIGN KEY (discount_id)
        REFERENCES product.product_discounts(id) ON DELETE SET NULL,
    CONSTRAINT ck_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT ck_order_items_unit_price CHECK (unit_price > 0)
);

CREATE INDEX idx_order_items_order_id ON ordering.order_items (order_id);
CREATE INDEX idx_order_items_product_id ON ordering.order_items (product_id);
CREATE INDEX idx_order_items_discount_id ON ordering.order_items (discount_id);

CREATE SCHEMA IF NOT EXISTS payment;

CREATE TABLE IF NOT EXISTS payment.payments (
    id UUID NOT NULL PRIMARY KEY,
    idempotency_key VARCHAR(255) NOT NULL,
    order_id UUID NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    amount NUMERIC(12, 2) NOT NULL,
    transaction_ref VARCHAR(255),
    paid_at TIMESTAMP(6),
    note TEXT,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6),

    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES ordering.orders(id),
    CONSTRAINT uk_payments_idempotency_key UNIQUE (idempotency_key),
    CONSTRAINT uk_payments_transaction_ref UNIQUE (transaction_ref)
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON payment.payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_order_status ON payment.payments (order_id, status);

CREATE SCHEMA IF NOT EXISTS shipping;

CREATE TABLE IF NOT EXISTS shipping.shipments (
    id UUID NOT NULL PRIMARY KEY,
    order_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    -- PENDING -> PICKED_UP -> IN_TRANSIT -> DELIVERED / FAILED / RETURNED

    carrier VARCHAR(100),
    tracking_code VARCHAR(255),
    address_line VARCHAR(500) NOT NULL,
    shipped_at TIMESTAMP(6),
    delivered_at TIMESTAMP(6),

    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shipments_order FOREIGN KEY (order_id) REFERENCES ordering.orders(id),
    CONSTRAINT uk_shipments_tracking_code UNIQUE (tracking_code)
);

CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipping.shipments (status);

-- CREATE SCHEMA IF NOT EXISTS statistics;
--
-- CREATE TABLE IF NOT EXISTS statistics.product_sale_facts  (
--     id BIGINT NOT NULL PRIMARY KEY,
--
--     account_id UUID NOT NULL,
--     order_item_id BIGINT NOT NULL,
--
--     product_id UUID NOT NULL,
--     product_name VARCHAR(255) NOT NULL,
--     product_sku VARCHAR(50) NOT NULL,
--
--     category_id UUID NOT NULL,
--     category_name VARCHAR(255) NOT NULL,
--
--     brand_id UUID NOT NULL,
--     brand_name VARCHAR(255) NOT NULL,
--
--     discount_label VARCHAR(255) NULL,
--
--     quantity INT NOT NULL,
--     line_total NUMERIC(12,2) NOT NULL,
--     line_cost NUMERIC(12,2) NOT NULL,
--
--     sold_at TIMESTAMP(6) NOT NULL,
--
--     CONSTRAINT uk_sale_facts_order_item UNIQUE (order_item_id)
-- );

-- CREATE INDEX IF NOT EXISTS idx_sale_facts_product_sold_at ON statistics.product_sale_facts (product_id, sold_at);

CREATE TABLE IF NOT EXISTS product.promotion_banner (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255),
    banner_url VARCHAR(255) NOT NULL,
    detail_url VARCHAR(255)
);