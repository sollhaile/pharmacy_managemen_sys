#!/bin/bash

# ============================================
# PHARMACY SYSTEM - COMPLETE TEST & REPORT GENERATOR
# ============================================
# This script tests ALL endpoints and generates
# a professional HTML report with business insights
# ============================================

SERVER_URL="http://localhost:5000"
REPORT_FILE="pharmacy-system-report-$(date +%Y%m%d-%H%M%S).html"
REPORT_TITLE="Pharmacy Management System - Complete Test Report"
TEST_DATE=$(date "+%B %d, %Y at %H:%M:%S")

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}   PHARMACY SYSTEM - COMPLETE TEST SUITE   ${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "${YELLOW}Server:${NC} $SERVER_URL"
echo -e "${YELLOW}Date:${NC} $TEST_DATE"
echo -e "${YELLOW}Report:${NC} $REPORT_FILE"
echo ""

# Arrays to store test results
declare -a TEST_NAMES=()
declare -a TEST_STATUSES=()
declare -a TEST_RESPONSES=()

# ============================================
# HELPER FUNCTIONS
# ============================================

# Function to run test and capture response
run_test() {
    local test_name="$1"
    local curl_command="$2"
    local expected_status="${3:-200}"
    
    echo -e "${BLUE}▶ Testing:${NC} $test_name"
    TEST_NAMES+=("$test_name")
    
    # Execute curl command and capture response
    local response=$(eval "$curl_command" 2>/dev/null)
    local http_code=$(eval "curl -s -o /dev/null -w '%{http_code}' ${curl_command#curl *}")
    
    # Check if response contains "success":true
    if [[ $response == *'"success":true'* ]] || [[ $http_code -eq $expected_status ]]; then
        echo -e "  ${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        TEST_STATUSES+=("PASS")
    else
        echo -e "  ${RED}❌ FAILED${NC} (HTTP $http_code)"
        TEST_STATUSES+=("FAIL")
    fi
    
    TEST_RESPONSES+=("$response")
    echo ""
}

# Function to extract value from JSON
extract_json() {
    local json="$1"
    local key="$2"
    echo "$json" | grep -o "\"$key\":[^,}]*" | cut -d':' -f2 | tr -d '"' | head -1
}

# ============================================
# BEGIN TESTING - HEALTH CHECK
# ============================================
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    1. SYSTEM HEALTH CHECK                ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

run_test "Health Endpoint" "curl -s $SERVER_URL/health"

# ============================================
# 2. MEDICINE MODULE TESTS
# ============================================
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    2. MEDICINE MANAGEMENT MODULE         ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

run_test "Get All Medicines" "curl -s $SERVER_URL/api/medicines"
run_test "Get Medicine Categories" "curl -s $SERVER_URL/api/medicines/categories"
run_test "Get Low Stock Medicines" "curl -s $SERVER_URL/api/medicines/low-stock"

# Get a specific medicine ID
# Better way to extract medicine_id using grep and cut
# Better way to extract medicine_id using grep and cut
MEDICINE_ID=$(curl -s "$SERVER_URL/api/medicines" | grep -o '"medicine_id":[0-9]*' | head -1 | cut -d':' -f2)
# ============================================
# 3. SUPPLIER MODULE TESTS
# ============================================
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    3. SUPPLIER MANAGEMENT MODULE         ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

run_test "Get All Suppliers" "curl -s $SERVER_URL/api/suppliers"

# Get supplier ID
SUPPLIER_ID=$(curl -s "$SERVER_URL/api/suppliers" | grep -m1 "supplier_id" | awk '{print $2}' | tr -d ',')

# ============================================
# 4. BATCH/INVENTORY MODULE TESTS
# ============================================
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    4. INVENTORY MANAGEMENT MODULE        ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

run_test "Get All Batches" "curl -s $SERVER_URL/api/batches"
run_test "Get Expiring Soon (30 days)" "curl -s '$SERVER_URL/api/batches/expiring?days=30'"
run_test "Get Expiring Soon (90 days)" "curl -s '$SERVER_URL/api/batches/expiring?days=90'"

# Get batch ID
MEDICINE_ID=$(curl -s "$SERVER_URL/api/medicines" | grep -o '"medicine_id":[0-9]*' | head -1 | cut -d':' -f2)

# ============================================
# 5. DASHBOARD MODULE TESTS
# ============================================
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    5. DASHBOARD & ANALYTICS MODULE      ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

run_test "Dashboard Summary" "curl -s $SERVER_URL/api/dashboard/summary"
run_test "Sales Report (Month)" "curl -s '$SERVER_URL/api/dashboard/sales-report?period=month'"
run_test "Inventory Insights" "curl -s $SERVER_URL/api/dashboard/inventory-insights"
run_test "Customer Insights" "curl -s $SERVER_URL/api/dashboard/customer-insights"
run_test "Financial Dashboard" "curl -s $SERVER_URL/api/dashboard/financial"
run_test "Profit & Loss Statement" "curl -s '$SERVER_URL/api/dashboard/pl?period=month'"
run_test "Inventory Valuation" "curl -s $SERVER_URL/api/dashboard/inventory-valuation"
run_test "Cash Flow" "curl -s $SERVER_URL/api/dashboard/cashflow"

# ============================================
# 6. ALERT MODULE TESTS
# ============================================
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    6. NOTIFICATION & ALERT MODULE       ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

run_test "Check Low Stock Alerts" "curl -s -X POST $SERVER_URL/api/alerts/check-low-stock"
run_test "Check Expiry Alerts" "curl -s -X POST $SERVER_URL/api/alerts/check-expiry"
run_test "Check Critical Alerts" "curl -s -X POST $SERVER_URL/api/alerts/check-critical"

# ============================================
# 7. WASTAGE & RETURNS MODULE TESTS
# ============================================
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    7. WASTAGE & RETURNS MODULE          ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

run_test "Get Wastage Reports" "curl -s $SERVER_URL/api/wastage"
run_test "Get Returns" "curl -s $SERVER_URL/api/returns"

# ============================================
# 8. SUPPLIER ORDERS MODULE TESTS
# ============================================
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    8. SUPPLIER ORDER MODULE             ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

run_test "Create Supplier Order" "curl -s -X POST $SERVER_URL/api/supplier-orders -H 'Content-Type: application/json' -d '{\"supplier_id\":1,\"items\":[{\"medicine_id\":1,\"quantity\":100,\"unit_price\":2.20}],\"notes\":\"Test order\"}'"

# ============================================
# EXTRACT BUSINESS INTELLIGENCE
# ============================================

echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    EXTRACTING BUSINESS INTELLIGENCE      ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

# Get dashboard summary for metrics
DASHBOARD_DATA=$(curl -s "$SERVER_URL/api/dashboard/summary")
INVENTORY_DATA=$(curl -s "$SERVER_URL/api/dashboard/inventory-insights")
FINANCIAL_DATA=$(curl -s "$SERVER_URL/api/dashboard/financial")
CUSTOMER_DATA=$(curl -s "$SERVER_URL/api/dashboard/customer-insights")

# Extract key metrics
TOTAL_MEDICINES=$(echo "$DASHBOARD_DATA" | grep -o '"medicines":[0-9]*' | cut -d':' -f2)
TOTAL_CUSTOMERS=$(echo "$DASHBOARD_DATA" | grep -o '"customers":[0-9]*' | head -1 | cut -d':' -f2)
LOW_STOCK_COUNT=$(echo "$DASHBOARD_DATA" | grep -o '"low_stock":[0-9]*' | cut -d':' -f2)
EXPIRING_COUNT=$(echo "$DASHBOARD_DATA" | grep -o '"expiring_soon":[0-9]*' | cut -d':' -f2)

SALES_TODAY=$(echo "$DASHBOARD_DATA" | grep -o '"today":[0-9.]*' | head -1 | cut -d':' -f2)
SALES_MONTH=$(echo "$DASHBOARD_DATA" | grep -o '"month":[0-9.]*' | head -2 | tail -1 | cut -d':' -f2)
PROFIT_TODAY=$(echo "$DASHBOARD_DATA" | grep -o '"today":[0-9.]*' | tail -1 | cut -d':' -f2)
PROFIT_MONTH=$(echo "$DASHBOARD_DATA" | grep -o '"month":[0-9.]*' | tail -1 | cut -d':' -f2)

INVENTORY_COST=$(echo "$INVENTORY_DATA" | grep -o '"cost":[0-9.]*' | head -1 | cut -d':' -f2)
INVENTORY_RETAIL=$(echo "$INVENTORY_DATA" | grep -o '"retail":[0-9.]*' | head -1 | cut -d':' -f2)
POTENTIAL_PROFIT=$(echo "$INVENTORY_DATA" | grep -o '"potential_profit":[0-9.]*' | head -1 | cut -d':' -f2)

echo -e "${GREEN}✅ Business intelligence extracted${NC}"

# ============================================
# GENERATE HTML REPORT
# ============================================

echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}    GENERATING HTML REPORT                ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"

# Calculate pass/fail statistics
TOTAL_TESTS=${#TEST_NAMES[@]}
PASSED_COUNT=0
FAILED_COUNT=0

for status in "${TEST_STATUSES[@]}"; do
    if [[ "$status" == "PASS" ]]; then
        PASSED_COUNT=$((PASSED_COUNT + 1))
    else
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
done

PASS_PERCENTAGE=$((PASSED_COUNT * 100 / TOTAL_TESTS))
SYSTEM_HEALTH=$([ $FAILED_COUNT -eq 0 ] && echo "EXCELLENT" || ([ $PASS_PERCENTAGE -ge 80 ] && echo "GOOD" || echo "NEEDS ATTENTION"))

# Generate HTML
cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$REPORT_TITLE</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fb;
            color: #1e293b;
            line-height: 1.6;
            padding: 30px 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
            padding: 40px;
        }
        .header {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            color: white;
            padding: 30px 40px;
            border-radius: 16px;
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .header .date {
            opacity: 0.9;
            font-size: 14px;
        }
        .health-badge {
            background: rgba(255,255,255,0.2);
            padding: 12px 24px;
            border-radius: 40px;
            font-weight: 600;
            display: inline-block;
        }
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
        }
        .kpi-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            transition: transform 0.2s;
        }
        .kpi-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.05);
        }
        .kpi-label {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .kpi-value {
            font-size: 32px;
            font-weight: 700;
            color: #0f172a;
        }
        .kpi-trend {
            font-size: 14px;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }
        
        .section {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 28px;
            margin-bottom: 32px;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .section-title i {
            color: #2563eb;
        }
        
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 16px;
        }
        .test-item {
            background: #f8fafc;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .test-name {
            font-weight: 500;
            color: #334155;
        }
        .test-status {
            padding: 6px 16px;
            border-radius: 24px;
            font-size: 13px;
            font-weight: 600;
        }
        .status-pass {
            background: #dcfce7;
            color: #166534;
        }
        .status-fail {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .metrics-table {
            width: 100%;
            border-collapse: collapse;
        }
        .metrics-table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        .metrics-table tr:last-child td {
            border-bottom: none;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-critical { background: #fee2e2; color: #991b1b; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .badge-good { background: #d1fae5; color: #065f46; }
        
        .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .system-status {
            display: inline-block;
            padding: 8px 24px;
            border-radius: 40px;
            font-weight: 600;
            margin-bottom: 24px;
        }
        .status-excellent { background: #d1fae5; color: #065f46; }
        .status-good { background: #fef9c3; color: #854d0e; }
        .status-needs-attention { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div>
                <h1>🏥 Pharmacy Management System</h1>
                <div class="date">Test Report Generated: $TEST_DATE</div>
                <div style="margin-top: 16px;">
                    <span class="health-badge">🔗 Server: $SERVER_URL</span>
                </div>
            </div>
            <div>
                <div class="system-status status-$(echo $SYSTEM_HEALTH | tr '[:upper:]' '[:lower:]' | tr ' ' '-')">
                    SYSTEM HEALTH: $SYSTEM_HEALTH
                </div>
                <div style="margin-top: 8px; text-align: right;">
                    <span style="background: #2563eb; color: white; padding: 6px 16px; border-radius: 24px; font-size: 13px;">
                        ✅ $PASSED_COUNT/$TOTAL_TESTS Tests Passing
                    </span>
                </div>
            </div>
        </div>

        <!-- Executive Summary -->
        <div class="section">
            <div class="section-title">
                <span>📋 EXECUTIVE SUMMARY</span>
            </div>
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">💰 Today's Sales</div>
                    <div class="kpi-value">ETB ${SALES_TODAY:-0}</div>
                    <div class="kpi-trend">
                        <span class="trend-up">▲</span> vs yesterday
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">📊 Monthly Sales</div>
                    <div class="kpi-value">ETB ${SALES_MONTH:-0}</div>
                    <div class="kpi-trend">This month</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">💵 Today's Profit</div>
                    <div class="kpi-value">ETB ${PROFIT_TODAY:-0}</div>
                    <div class="kpi-trend">Margin: --</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">📦 Inventory Value</div>
                    <div class="kpi-value">ETB ${INVENTORY_RETAIL:-0}</div>
                    <div class="kpi-trend">Cost: ETB ${INVENTORY_COST:-0}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">🏪 Total Medicines</div>
                    <div class="kpi-value">${TOTAL_MEDICINES:-0}</div>
                    <div class="kpi-trend">
                        <span class="badge badge-critical">⚠️ ${LOW_STOCK_COUNT:-0} Low Stock</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">👥 Total Customers</div>
                    <div class="kpi-value">${TOTAL_CUSTOMERS:-0}</div>
                    <div class="kpi-trend">
                        <span class="badge badge-warning">⏰ ${EXPIRING_COUNT:-0} Expiring</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Inventory Health Dashboard -->
        <div class="section">
            <div class="section-title">
                <span>📦 INVENTORY HEALTH DASHBOARD</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <div style="background: #f8fafc; padding: 24px; border-radius: 16px;">
                    <h3 style="margin-bottom: 16px; color: #0f172a;">📊 Stock Value Analysis</h3>
                    <table class="metrics-table">
                        <tr>
                            <td>Cost Value</td>
                            <td style="font-weight: 600;">ETB ${INVENTORY_COST:-0}</td>
                        </tr>
                        <tr>
                            <td>Retail Value</td>
                            <td style="font-weight: 600; color: #2563eb;">ETB ${INVENTORY_RETAIL:-0}</td>
                        </tr>
                        <tr>
                            <td>Potential Profit</td>
                            <td style="font-weight: 600; color: #10b981;">ETB ${POTENTIAL_PROFIT:-0}</td>
                        </tr>
                        <tr>
                            <td>Profit Margin</td>
                            <td style="font-weight: 600;">
                                $(if [[ $(echo "${INVENTORY_COST:-0} > 0" | bc -l) -eq 1 ]]; then 
                                    echo "scale=2; (${POTENTIAL_PROFIT:-0} / ${INVENTORY_COST:-0}) * 100" | bc | xargs printf "%.1f"
                                else echo "0"; fi)%
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="background: #f8fafc; padding: 24px; border-radius: 16px;">
                    <h3 style="margin-bottom: 16px; color: #0f172a;">⚠️ Risk Assessment</h3>
                    <table class="metrics-table">
                        <tr>
                            <td>Low Stock Items</td>
                            <td><span class="badge badge-critical">🔴 ${LOW_STOCK_COUNT:-0} Critical</span></td>
                        </tr>
                        <tr>
                            <td>Expiring Soon (30d)</td>
                            <td><span class="badge badge-critical">🔴 --</span></td>
                        </tr>
                        <tr>
                            <td>Expiring Soon (90d)</td>
                            <td><span class="badge badge-warning">🟡 ${EXPIRING_COUNT:-0}</span></td>
                        </tr>
                        <tr>
                            <td>System Health Score</td>
                            <td><span style="font-weight: 600; color: #2563eb;">${PASS_PERCENTAGE}%</span></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <!-- Test Results by Module -->
        <div class="section">
            <div class="section-title">
                <span>🧪 MODULE TEST RESULTS</span>
            </div>
            <div style="margin-bottom: 24px; display: flex; gap: 16px;">
                <span style="background: #d1fae5; padding: 8px 16px; border-radius: 24px; color: #065f46;">
                    ✅ Passed: $PASSED_COUNT
                </span>
                <span style="background: #fee2e2; padding: 8px 16px; border-radius: 24px; color: #991b1b;">
                    ❌ Failed: $FAILED_COUNT
                </span>
                <span style="background: #e2e8f0; padding: 8px 16px; border-radius: 24px; color: #1e293b;">
                    📊 Total Tests: $TOTAL_TESTS
                </span>
            </div>
            
            <div class="test-grid">
EOF

# Add test results
for i in "${!TEST_NAMES[@]}"; do
    cat >> "$REPORT_FILE" << EOF
                <div class="test-item">
                    <span class="test-name">${TEST_NAMES[$i]}</span>
                    <span class="test-status status-$(echo "${TEST_STATUSES[$i]}" | tr '[:upper:]' '[:lower:]')">${TEST_STATUSES[$i]}</span>
                </div>
EOF
done

cat >> "$REPORT_FILE" << EOF
            </div>
        </div>

        <!-- Business Recommendations -->
        <div class="section">
            <div class="section-title">
                <span>💡 BUSINESS RECOMMENDATIONS</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
EOF

# Add recommendations based on test results
if [[ $(echo "${LOW_STOCK_COUNT:-0} > 5" | bc -l) -eq 1 ]]; then
    cat >> "$REPORT_FILE" << EOF
                <div style="background: #fff3cd; padding: 20px; border-radius: 12px;">
                    <h4 style="color: #856404; margin-bottom: 8px;">⚠️ Critical Low Stock Alert</h4>
                    <p style="color: #856404; font-size: 14px;">$LOW_STOCK_COUNT medicines are below reorder level. Place urgent purchase orders.</p>
                </div>
EOF
fi

if [[ $(echo "${EXPIRING_COUNT:-0} > 3" | bc -l) -eq 1 ]]; then
    cat >> "$REPORT_FILE" << EOF
                <div style="background: #fff3cd; padding: 20px; border-radius: 12px;">
                    <h4 style="color: #856404; margin-bottom: 8px;">⏰ Expiring Stock Alert</h4>
                    <p style="color: #856404; font-size: 14px;">$EXPIRING_COUNT batches expiring soon. Consider discounts or supplier returns.</p>
                </div>
EOF
fi

if [[ $FAILED_COUNT -eq 0 ]]; then
    cat >> "$REPORT_FILE" << EOF
                <div style="background: #d1fae5; padding: 20px; border-radius: 12px;">
                    <h4 style="color: #065f46; margin-bottom: 8px;">✅ System Health Excellent</h4>
                    <p style="color: #065f46; font-size: 14px;">All systems operational. No critical issues detected.</p>
                </div>
EOF
fi

cat >> "$REPORT_FILE" << EOF
            </div>
        </div>

        <!-- System Configuration -->
        <div class="section">
            <div class="section-title">
                <span>⚙️ SYSTEM CONFIGURATION</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                <div>
                    <div style="color: #64748b; font-size: 12px;">Node Version</div>
                    <div style="font-weight: 600;">v22.22.0</div>
                </div>
                <div>
                    <div style="color: #64748b; font-size: 12px;">Database</div>
                    <div style="font-weight: 600;">PostgreSQL</div>
                </div>
                <div>
                    <div style="color: #64748b; font-size: 12px;">ORM</div>
                    <div style="font-weight: 600;">Sequelize</div>
                </div>
                <div>
                    <div style="color: #64748b; font-size: 12px;">Notifications</div>
                    <div style="font-weight: 600;">Telegram</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Pharmacy Management System - Complete Test Report</p>
            <p style="margin-top: 8px;">Generated by Automated Test Suite | © 2026</p>
        </div>
    </div>
</body>
</html>
EOF

# ============================================
# FINAL OUTPUT
# ============================================
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}   REPORT GENERATED SUCCESSFULLY!         ${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Report file:${NC} $REPORT_FILE"
echo -e "${YELLOW}Full path:${NC} $(pwd)/$REPORT_FILE"
echo -e "${YELLOW}Total tests:${NC} $TOTAL_TESTS"
echo -e "${YELLOW}Passed:${NC} ${GREEN}$PASSED_COUNT${NC}"
echo -e "${YELLOW}Failed:${NC} ${RED}$FAILED_COUNT${NC}"
echo -e "${YELLOW}Success rate:${NC} ${BLUE}${PASS_PERCENTAGE}%${NC}"
echo ""
echo -e "${CYAN}To view the report:${NC}"
echo -e "  firefox $REPORT_FILE"
echo -e "  google-chrome $REPORT_FILE"
echo -e "  open $REPORT_FILE (Mac)"
echo ""
echo -e "${GREEN}✅ Test suite complete!${NC}"
