---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-Prophesee-2026-02-22.md
  - docs/STARLIGHT_System_Requirements_v2.md
  - docs/castodio.md
  - docs/architecture.MD
  - docs/HLD.drawio
  - docs/Attack_Agent_Demo_System_Specification.md
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 5
classification:
  projectType: "Web Application (SPA) + Enterprise B2B Platform"
  domain: "Defense & National Security (C4ISR)"
  complexity: high
  projectContext: brownfield
workflowType: 'prd'
---

# Product Requirements Document - Prophesee

**Author:** Alon
**Date:** 2026-02-22

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
  - [1.1 What Makes This Special](#11-what-makes-this-special)
- [2. Project Classification](#2-project-classification)
- [3. Success Criteria](#3-success-criteria)
  - [3.1 User Success](#31-user-success)
  - [3.2 Business Success](#32-business-success)
  - [3.3 Technical Success](#33-technical-success)
  - [3.4 Measurable Outcomes](#34-measurable-outcomes)
- [4. Product Scope](#4-product-scope)
  - [4.1 MVP Strategy & Philosophy](#41-mvp-strategy--philosophy)
  - [4.2 MVP Feature Set (Phase 1)](#42-mvp-feature-set-phase-1)
  - [4.3 Post-MVP Features](#43-post-mvp-features)
  - [4.4 Risk Mitigation Strategy](#44-risk-mitigation-strategy)
- [5. User Journeys](#5-user-journeys)
  - [5.1 Journey 1: Intelligence Analyst — SAR Detection Investigation](#51-journey-1-intelligence-analyst--sar-detection-investigation)
  - [5.2 Journey 2: SA Operator — Real-Time Alert Response](#52-journey-2-sa-operator--real-time-alert-response)
  - [5.3 Journey 3: Commander — Operational Decision Cycle](#53-journey-3-commander--operational-decision-cycle)
  - [5.4 Journey 4: System Administrator — Platform Deployment & User Management](#54-journey-4-system-administrator--platform-deployment--user-management)
  - [5.5 Journey 5: Technical Operator — System Health Monitoring & Incident Response](#55-journey-5-technical-operator--system-health-monitoring--incident-response)
  - [5.6 Journey 6: Intelligence Analyst — Attack Agent TCT Workflow (Demo Scenario)](#56-journey-6-intelligence-analyst--attack-agent-tct-workflow-demo-scenario)
  - [5.7 Journey Requirements Summary](#57-journey-requirements-summary)
- [6. Domain-Specific Requirements](#6-domain-specific-requirements)
  - [6.1 Compliance & Standards](#61-compliance--standards)
  - [6.2 Internal Data Representation](#62-internal-data-representation)
  - [6.3 Security Requirements](#63-security-requirements)
  - [6.4 Deployment Architecture](#64-deployment-architecture)
  - [6.5 Partner Integration Requirements](#65-partner-integration-requirements)
  - [6.6 Domain-Specific Risks & Mitigations](#66-domain-specific-risks--mitigations)
- [7. Innovation & Novel Patterns](#7-innovation--novel-patterns)
  - [7.1 Detected Innovation Areas](#71-detected-innovation-areas)
  - [7.2 Validation Approach](#72-validation-approach)
  - [7.3 Risk Mitigation](#73-risk-mitigation)
- [8. Web Application & Enterprise Platform Requirements](#8-web-application--enterprise-platform-requirements)
  - [8.1 Project-Type Overview](#81-project-type-overview)
  - [8.2 Browser Support Matrix](#82-browser-support-matrix)
  - [8.3 Responsive Design & Display Targets](#83-responsive-design--display-targets)
  - [8.4 Performance Targets](#84-performance-targets)
  - [8.5 Tenant Model](#85-tenant-model)
  - [8.6 RBAC & Permission Matrix](#86-rbac--permission-matrix)
  - [8.7 Integration List](#87-integration-list)
  - [8.8 Compliance Requirements (Platform-Level)](#88-compliance-requirements-platform-level)
  - [8.9 Implementation Considerations](#89-implementation-considerations)
- [9. Functional Requirements](#9-functional-requirements)
  - [9.1 Map & Geospatial Visualization](#91-map--geospatial-visualization)
  - [9.2 Detection Management](#92-detection-management)
  - [9.3 Sites Management](#93-sites-management)
  - [9.4 Rule Engine & Alerting](#94-rule-engine--alerting)
  - [9.5 Collaborative Chat](#95-collaborative-chat)
  - [9.6 AI Agent Kill Chain (Attack Agent Demo)](#96-ai-agent-kill-chain-attack-agent-demo)
  - [9.7 SAR Exploitation](#97-sar-exploitation)
  - [9.8 Identity, Access & Data Scoping](#98-identity-access--data-scoping)
  - [9.9 Platform Infrastructure & Operations](#99-platform-infrastructure--operations)
  - [9.10 Partner System Integration](#910-partner-system-integration)
- [10. Non-Functional Requirements](#10-non-functional-requirements)
  - [10.1 Performance](#101-performance)
  - [10.2 Security](#102-security)
  - [10.3 Scalability](#103-scalability)
  - [10.4 Reliability & Availability](#104-reliability--availability)
  - [10.5 Observability](#105-observability)
  - [10.6 Maintainability & Deployability](#106-maintainability--deployability)
  - [10.7 Integration Reliability](#107-integration-reliability)
- [11. Development Timetable](#11-development-timetable)
- [12. Abbreviations](#12-abbreviations)

## 1. Executive Summary

Prophesee is a next-generation Multi-INT C4ISR situational awareness and intelligence platform that replaces a legacy monolithic system with a modern, open-architecture design. Built on a cloud-native microservices backend (C#/Node, RabbitMQ, gRPC) with a Cesium/React Module Federation frontend using Material Design (MUI), Prophesee correlates multi-disciplinary ISR sensor data into a unified real-time operational picture for intelligence analysts, SA operators, commanders, technical operators, and system administrators across multiple physical sites.

The platform addresses a fundamental architectural limitation of legacy C4ISR systems: rigidity. Legacy systems are sensor-siloed, difficult to extend, and cannot scale across deployment tiers without separate codebases. Prophesee solves this through a sensor-agnostic gateway pattern, multi-repository code separation, and a standards-ready architecture — OGC-compliant geospatial services from day one (with the application consuming only OGC standard interfaces, never proprietary geospatial server APIs), with military and maritime standards (STANAG 4676, ASTERIX, NMEA) integrated via dedicated gateways in future phases. Any sensor can be integrated by implementing a gateway, any capability can be developed and deployed independently, and any deployment scale from a single tactical node to a nationwide distributed intelligence center is supported by the same codebase.

Users are managed through KeyCloak SSO with RBAC authorization (JWT-enforced at every service boundary, with feature permission codes embedded in the token via KeyCloak Protocol Mappers) and organized into groups that scope data visibility by region or responsibility. A Big Data/ML analytics stack underlies the operational layer, fed by ETL connectors from the message bus, enabling future AI algorithm development and deployment as plug-in microservices. An integrated collaborative chat system supports real-time communication between users — including data item sharing, map pointers, file attachments, and a future AI/LLM assistant.

Phase 1 is defined by the Attack Agent Demo — a Platform Demo MVP that proves both the core SA architecture and the AI agent-orchestrated TCT kill chain end-to-end. The core SA application (detections, sites, rule engine, alerts, chat, layer visibility control) provides the operational foundation on which the demo runs. Phase 2 expands to live sensor integration, AIS data correlation via a Correlation Service, and SCD algorithm development. Subsequent phases add additional standard-specific gateways, data classification and scoping, and enterprise-scale deployments.

### 1.1 What Makes This Special

1. **Gateway-driven sensor agnosticism** — the core platform operates on canonical data models; new sensors are added by implementing gateways in separate repositories, never touching the core
2. **True code-level decoupling** — Module Federation frontend + multi-repo architecture means each capability domain (SAR, SIGINT, chat, rules) is independently developed, versioned, and deployed
3. **Deployment-scale identity** — the same platform, same codebase, serves tactical field stations and national intelligence centers, differentiated only by which services and modules are deployed
4. **Standards-ready gateway architecture** — OGC compliance via GeoServer from day one; military and maritime standards (STANAG 4676, ASTERIX, NMEA) are integrated through the same gateway pattern in future phases, ensuring the architecture supports them without retroactive changes
5. **AI-ready without AI dependency** — the Big Data/ML stack is architecturally planned but Phase 1 delivers full operational value without it; algorithms plug in as standalone services when ready
6. **OGC-only geospatial abstraction** — the application communicates exclusively through OGC standards (WMS/WFS/WCS), never using proprietary geospatial server APIs; this enables future replacement of the underlying geospatial server without application changes

## 2. Project Classification

- **Project Type:** Web Application (SPA) + Enterprise B2B Platform
- **Domain:** Defense & National Security (C4ISR)
- **Complexity:** High — regulated defense domain, real-time multi-sensor correlation, multi-site distributed deployment, stringent security and compliance requirements (OGC, OWASP), standards-ready architecture for future military/maritime protocol integration (STANAG 4676, ASTERIX, NMEA), legacy modernization constraints
- **Project Context:** Brownfield — modernization of a legacy C4ISR system, developed as a multi-customer product
- **Technology Stack:** React/Cesium (Module Federation, WebKit base, Material Design/MUI), C#/Node microservices, RabbitMQ, gRPC, PostgreSQL/PostGIS, MongoDB, Redis, GeoServer, KeyCloak, Tyk API Gateway, MinIO, Kubernetes/Helm, Consul, Vault, Prometheus/Grafana, OpenTelemetry

## 3. Success Criteria

### 3.1 User Success

| Role | Success Definition | Measurable Indicator |
|------|-------------------|---------------------|
| Intelligence Analyst | Spend the majority of time on high-value analysis, not routine correlation | Rule engine automates routine monitoring; unified multi-sensor display eliminates context-switching between tools |
| SA Operator | Respond to real events without alert fatigue | Priority-based alerting delivers actionable notifications; false positive rate decreases over time with rule tuning |
| Commander | Make decisions from a current, complete operational picture | Real-time situational awareness across all active sensor feeds; alert-to-decision cycle measurably shorter than legacy |
| Technical Operator | Diagnose system issues without hunting across components | OpenTelemetry distributed tracing, centralized logging, and real-time health dashboards provide full observability |
| System Administrator | Deploy updates and manage infrastructure without system-wide downtime | Independent module deployment via Helm; geospatial data managed through GeoServer; user/role management through KeyCloak |

**User success "aha" moment:** An SA Operator receives an immediate alert from the rule engine, clicks through to the detection on the map, shares the finding with an analyst via chat (including the map pointer), and the analyst classifies the detection — all within a single unified interface, across roles and groups.

### 3.2 Business Success

| Objective | Target | Timeframe |
|-----------|--------|-----------|
| Phase 1 delivery to first customer | Operational SA application with Capella SAR integration demonstrated with live or simulated data | First major milestone |
| Architecture validation | Second sensor gateway (e.g., ELINT) integrated by a separate team without core platform changes | Post Phase 1 |
| Multi-customer readiness | Platform deployed to at least two distinct customers with different deployment configurations | Within 12 months of Phase 1 |
| Legacy replacement | First customer transitions from legacy system to Prophesee for operational use | Per customer engagement |
| Platform extensibility | New gateway development time measurably faster than equivalent legacy integration effort | Ongoing |

### 3.3 Technical Success

#### 3.3.1 Security

- KeyCloak SSO with RBAC enforced across all system flows via JWT validated at every service boundary
- Group-based data scoping operational — users see only their groups' data; ungrouped users see all
- Encryption at rest and in transit for all data
- OWASP Top 10 compliance validated

#### 3.3.2 Stability & Resilience

- Stateless services with automatic recovery from single-node failures
- Graceful degradation when individual sensor gateways or services are unavailable
- Zero data loss during service restarts or failovers
- Kubernetes-managed health checks and self-healing

#### 3.3.3 Performance

- Alert delivery: immediate (real-time) — from gateway ingestion to operator notification via WebSocket push
- Data display: minimal latency from ingestion to rendering on operator's screen
- Map rendering: 60 FPS sustained during navigation on standard hardware
- Concurrent users: scales with deployment tier (tactical: 5-10, theater: 50-100, strategic: 1000+)
- System availability: 99.9% uptime

#### 3.3.4 Usability

- Operators perform core SA tasks (view detections, respond to alerts, manage sites) with minimal training
- Consistent Material Design (MUI) patterns across all federated modules
- Responsive interface across desktop and large-format displays

### 3.4 Measurable Outcomes

| KPI | Definition | Connected Differentiator |
|-----|-----------|------------------------|
| Sensor-to-operator cycle time | Time from sensor data at gateway to detection rendered on operator's screen | Gateway-driven sensor agnosticism |
| Alert-to-action cycle time | Time from alert generation to commander decision | Real-time operational picture |
| Module independence rate | % of deployments/updates requiring zero changes to other modules | True code-level decoupling |
| Gateway reuse index | Number of customers/deployments using the same gateway implementation | Deployment-scale identity |
| New gateway integration time | Development time from gateway start to operational data flow | Standards-ready gateway architecture |
| System uptime | Measured availability across all deployment tiers | Infrastructure resilience |

## 4. Product Scope

### 4.1 MVP Strategy & Philosophy

**MVP Approach:** Platform Demo MVP — the minimum viable product is defined by what's needed to successfully demonstrate the Attack Agent TCT workflow end-to-end on a working SA platform. The demo is the proof point; the core SA capabilities are the foundation it runs on.

**Strategic Logic:** The Attack Agent Demo is the first "client" of the Prophesee platform. Its success proves two things simultaneously: (1) the core platform architecture works (Module Federation, gateways, protobuf data model, RBAC, real-time data flow), and (2) the AI agent-orchestrated kill chain delivers operational value.

**Resource Reality:**
- 2 full-time software engineers (AI-augmented development)
- 1 Product Manager
- 1 Project Manager
- 1 QA Engineer (AI-augmented testing)
- 1 Architect (AI-augmented design)

The team operates with AI agents as force multipliers across development, testing, and architecture — enabling a lean team to deliver scope that would traditionally require 3-4x the headcount, but requiring disciplined prioritization.

### 4.2 MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Journey 6 (Attack Agent TCT Workflow) — **primary**, full end-to-end
- Journey 1 (Intelligence Analyst — SAR Detection Investigation) — **partial**, supports the demo context
- Journey 2 (SA Operator — Alert Response) — **partial**, alert flow needed for agent outputs

**Must-Have Capabilities (MVP):**

| # | Capability | Justification | Demo Dependency |
|---|-----------|---------------|-----------------|
| 1 | **WebKit Module Federation Shell** | Application foundation; all modules load here | Direct |
| 2 | **Cesium 3D Map Display** | Core visualization; all entities displayed on map | Direct |
| 3 | **KeyCloak SSO + RBAC** | Authentication and role-based access | Direct |
| 4 | **Detection Management** (display, classify, affiliate) | Core SA capability; detections are the demo's input | Direct |
| 5 | **Alert System** (generation, display, acknowledgment) | Agent outputs surface as alerts | Direct |
| 6 | **Chat System** (basic messaging + AI agent interface) | Correlation Agent uses chat for conversational queries | Direct |
| 7 | **Protobuf Data Model Repository** | Canonical data representation | Direct |
| 8 | **RabbitMQ Data Distribution** | Event streaming backbone | Direct |
| 9 | **SAR/SIGINT Data Ingestion** (demo data injection) | JSON-based simulated sensor data for demo | Direct |
| 10 | **ATC Integration** (IronBrain interface) | Few Shots SAR classification — first stage of kill chain | Direct |
| 11 | **Correlation Agent** (LLM-based multi-INT correlation) | Semantic VISINT/SIGINT correlation — second stage | Direct |
| 12 | **RoE Evaluation Interface** (external partner integration) | Engagement criteria assessment via external RoE evaluator — third stage | Direct |
| 13 | **Planning Aids Generation** (right-click → create planning aid) | Target package creation — fourth stage | Direct |
| 14 | **MSG Weaponeering Interface** | Send planning aids, receive strike plans — fifth stage | Direct |
| 15 | **Planning Approval Agent** (traffic-light assessment) | Risk evaluation and commander decision support — sixth stage | Direct |
| 16 | **Omnisys Tasking Interface** | Approved targets → execution planning — seventh stage | Direct |
| 17 | **HITL Approval Gates** | Human decision points at every agent stage | Direct |
| 18 | **Infrastructure Foundation** (K8s/Helm, Consul, Vault, Tyk, Redis, PostgreSQL, MongoDB, MinIO) | Platform runtime | Direct |
| 19 | **Basic Observability** (Prometheus/Grafana, OpenTelemetry) | System monitoring during demo | Indirect |
| 20 | **Rule Engine Service** (.NET, Microsoft RulesEngine library) | Core SA capability; automated alerts from sensor data | Indirect |
| 21 | **Sites Management** (polygon-based, rule preset linking) | Rules bind to sites; geographic areas of interest | Indirect |
| 22 | **Map Data Filtering** (by entity type and geographic area) | Core SA usability; operators need to focus the display on relevant entities | Direct |
| 23 | **Layer Visibility Control** (tree-like layer display, show/hide checkboxes, z-order reordering) | Core map usability; operators need to control which geospatial layers are displayed and their rendering order | Direct |

**MVP Validation Gate:** Attack Agent Demo completes end-to-end with scripted data — full TCT kill chain from SAR/SIGINT detection through weaponeering approval, HITL gates functioning at every stage, core SA application providing operational context, and a second gateway integrable without core changes.

**Explicitly Deferred from MVP:**

| Capability | Reason for Deferral |
|-----------|-------------------|
| SAR Exploitation Tools (measurement, histogram, flicker) | Not part of demo workflow |
| Capella SAR Gateway (live integration) | Demo uses injected data, not live Capella feed |
| GeoServer Layer Management & Admin Tool | Phase 4 — base map with layer visibility control sufficient; advanced server-side layer management deferred |
| Admin Functions (system config, GCS, storage) | Manual configuration acceptable for first deployment |
| Touch/Tablet Optimization | Desktop-only for initial demo |
| Style Adaptation/Theming | Single deployment scenario initially |
| Advanced Rule Features (complex chaining, ML-based tuning) | Basic rule presets sufficient for MVP |
| AIS Gateway & Correlation Service | Phase 2 — not needed for demo workflow |
| SCD Algorithm | Phase 2 — requires operational SAR data pipeline |
| Data Classification & Data Scoping | Phase 4 — single-group demo scenario; classification and group-based scoping deferred |

### 4.3 Post-MVP Features

#### 4.3.1 Phase 2 — Operational SA Platform

- Capella SAR Gateway (live integration replacing demo data injection)
- **SCD (Scene Change Detection) Algorithm** — automated change detection comparing SAR images over time to identify new activity, construction, movement, or environmental changes
- **AIS Gateway** — ingest AIS (Automatic Identification System) maritime vessel data via a dedicated gateway translating AIS messages to the canonical protobuf data model
- **Correlation Service** — combine AIS vessel data with SAR/sensor detections to enrich the operational picture; automated correlation of AIS tracks with radar returns and SAR imagery detections
- SAR Exploitation Tools (measurement, brightness/contrast, flicker comparison)
- Admin Functions (system configuration, user management UI)
- Chat enhancements (file attachments, data item sharing beyond demo)
- Movement trails and detection history
- Information filtering (by discipline, site, affiliation)

#### 4.3.2 Phase 3 — Expanded Sensors & Intelligence Production

- Additional sensor gateways (SIGINT/ELINT, EO/IR, FMV)
- **STANAG 4676 Gateway** — NATO standard for motion imagery and track data
- **ASTERIX Gateway** — Eurocontrol surveillance data exchange standard
- **NMEA Gateway** — Maritime positioning standard
- Intelligence report generation (templates, GeoPDF, military formats)
- Advanced SAR exploitation (CCD, InSAR)
- Sensor management and cueing
- Touch/tablet-optimized layouts
- Style adaptation and deployment-specific theming

#### 4.3.3 Phase 4 — AI/ML, Data Governance & Enterprise Scale

- Big Data stack with ETL connectors
- ML model training and deployment pipeline
- AI/LLM chat bot (general-purpose, beyond Correlation Agent)
- **Data Classification** — system-wide classification category management with enforcement throughout the data pipeline
- **Group-Based Data Scoping** — users assigned to groups that scope data visibility by region or responsibility; users with no group see all data; query-layer enforcement
- **GeoServer Layer Management & Admin Tool** — server-side layer administration, data loading, and configuration (the only module permitted to use GeoServer-specific REST API)
- **Geospatial Data Loading Module** — dedicated module for loading data into GeoServer; the sole exception allowed to use GeoServer-specific API (not OGC)
- Multi-classification level support
- Strategic-scale deployments (1000+ users)
- Coalition operations

### 4.4 Risk Mitigation Strategy

#### 4.4.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM Correlation Agent unreliable in demo | Demo fails at stage 2 | Scripted/constrained responses for demo scenarios; fallback to pre-computed correlation results |
| Partner interface delays (IronBrain, MSG, Omnisys, RoE evaluator) | Kill chain incomplete | Adapter pattern with mock interfaces; demo can run with stubbed partner responses |
| 2-engineer bandwidth insufficient for full scope | MVP delayed | Strict priority queue — kill chain stages developed sequentially; non-demo features ruthlessly deferred |
| Module Federation complexity underestimated | Integration overhead | WebKit base already validated; follow existing patterns; architect provides guidance with AI augmentation |
| Protobuf schema churn during early development | Service instability | Stabilize core schemas early; use backward-compatible evolution rules from day one |

#### 4.4.2 Resource Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Engineer attrition (losing 1 of 2) | 50% capacity loss | AI augmentation reduces bus factor; comprehensive documentation; modular architecture allows handoff |
| AI agent tooling less effective than projected | Slower velocity | Conservative timeline estimates; scope can be trimmed to essential demo chain only |
| Partner delivery delays | Blocked on external interfaces | Mock interfaces allow development to continue; integration happens when partners deliver |

#### 4.4.3 Scope Contingency

| Cut Level | What Gets Trimmed | Demo Impact |
|-----------|------------------|-------------|
| **Level 1** — Minor trim | Observability reduced to basic health checks; admin functions fully manual | None — demo unaffected |
| **Level 2** — Moderate trim | Chat limited to AI agent interface only (no human-to-human); basic detection display without classification UI | Minor — demo still works, reduced SA context |
| **Level 3** — Emergency scope | BDA Planning stage stubbed; Tasking interface mocked | Demo shows 6 of 8 stages with clear "coming soon" for final 2 |

## 5. User Journeys

### 5.1 Journey 1: Intelligence Analyst — SAR Detection Investigation

**Persona:** Noa, Senior Intelligence Analyst, Northern Region group

**Opening Scene:** Noa starts her shift and logs into Prophesee via SSO. Her workspace loads with the analyst layout — detection panels, the Cesium map focused on her group's area of responsibility, and the chat sidebar. She sees 14 new alerts flagged overnight by the rule engine, prioritized by severity.

**Rising Action:** She clicks the highest-priority alert — a rule preset on a monitored port facility detected new SAR returns matching vessel-activity thresholds. The map zooms to the site, the triggering detection is highlighted with a red aura, and the detection panel shows the SAR image metadata. She opens the SAR image overlay, adjusts brightness/contrast to enhance the vessel signatures, uses the measurement tool to estimate vessel length, and runs a flicker comparison against the previous image of the same site.

**Climax:** The comparison reveals three new vessels that weren't present 12 hours ago, consistent with an unusual loading operation. Noa classifies the detections as "Hostile — Suspected," affiliates them to the site, and creates a chat message to her group's commander — attaching the detection data items and a map pointer to the exact berth location. She writes a brief assessment directly in the chat.

**Resolution:** The commander receives the chat notification immediately, reviews Noa's assessment with the linked map view, and initiates a course of action. Noa closes the alert and moves to the next one. What previously required switching between three separate legacy systems, manually geo-referencing screenshots, and sending email reports now happens in a single unified workflow.

**Requirements revealed:** Detection management, SAR exploitation tools, flicker comparison, alert-to-investigation flow, chat with data item sharing, map pointer sharing, detection classification/affiliation, rule engine alerts.

---

### 5.2 Journey 2: SA Operator — Real-Time Alert Response

**Persona:** Amit, SA Operator, watch floor duty, no group assignment (sees all data)

**Opening Scene:** Amit is on the 8-hour watch, monitoring the real-time situational awareness display on a large-format screen. The Cesium globe shows all active detections across every region — color-coded by affiliation (blue friendly, red hostile, yellow unknown, green neutral). Movement trails trace entity paths over the last 6 hours.

**Rising Action:** A pop-up notification appears — a rule preset on a sensitive border area has triggered. The alert is priority-high. Amit clicks the notification; the map animates to the site boundary, and the triggering detection flashes with a red aura. He opens the detection table filtered to this site and sees a cluster of 4 new SAR detections within the last 30 minutes, all classified as "Unknown."

**Climax:** Amit recognizes this as potentially significant — the site hadn't shown activity in weeks. He escalates by sharing the alert in the regional commander's chat channel with a map pointer and a note: "New activity cluster on Site Bravo, 4 unknowns in 30 min, recommend analyst review." He then checks adjacent sites using the information filter to see if there's correlated activity.

**Resolution:** The alert is acknowledged by the regional commander within minutes. An analyst picks up the investigation. Amit returns to monitoring the full picture. The rule engine continues evaluating — no further alerts fire, so Amit isn't overwhelmed by false positives. His watch continues with confidence that the system surfaces what matters.

**Edge case — False positive:** If the detections turn out to be sensor noise, the analyst closes the alert with a "false positive" classification. Over time, the rule preset thresholds can be tuned to reduce similar false triggers.

**Requirements revealed:** Real-time map display, WebSocket push alerts, alert pop-up notifications, movement trails, detection color-coding by affiliation, information filter, chat escalation, alert acknowledgment, large-format display support.

---

### 5.3 Journey 3: Commander — Operational Decision Cycle

**Persona:** Col. David, Group Commander for Southern Sector

**Opening Scene:** David opens Prophesee at his desk and sees the operational dashboard scoped to his group — Southern Sector. The map shows active sites, current detections, and a notification badge indicating 3 unresolved high-priority alerts from the past 4 hours.

**Rising Action:** He reviews the chat channel where his analysts have been discussing an evolving situation — a series of detections near a coastline site. One analyst has shared a classified detection with a map pointer and a brief assessment. David clicks the map pointer and the display centers on the area of interest with all relevant detections overlaid.

**Climax:** Based on the analyst's assessment and the visual picture, David decides to increase monitoring priority on the site. He adjusts the site's priority level and adds a note in the chat tasking the team to focus collection on this area. He reviews the other two alerts — one resolved by an analyst (closed), one still under investigation.

**Resolution:** David's decision is visible to the entire Southern Sector group. The SA operators on watch see the updated site priority. The analysts continue their investigation with clear commander intent communicated through the system. David spends 15 minutes getting a complete operational picture — compared to hours of briefings and phone calls in the legacy environment.

**Requirements revealed:** Group-scoped data view, commander dashboard, alert review, chat-based tasking, site priority management, cross-role visibility within groups.

---

### 5.4 Journey 4: System Administrator — Platform Deployment & User Management

**Persona:** Oren, System Administrator, deploying Prophesee for a new customer

**Opening Scene:** Oren has a fresh Kubernetes cluster provisioned. He begins deploying Prophesee using the Helm charts — core platform services, the SA module, the Capella SAR gateway, GeoServer, KeyCloak, and the supporting infrastructure (RabbitMQ, Consul, Vault).

**Rising Action:** After Helm deployment completes, Oren configures KeyCloak — creating the organizational structure: two operational groups ("Northern Sector" and "Southern Sector"), five roles (Intelligence Analyst, SA Operator, Commander, Technical Operator, System Administrator), and the initial user accounts with role and group assignments. He then loads the base map layers and geospatial reference data into GeoServer via the admin interface. He configures the Capella SAR gateway connection parameters and verifies data flow through RabbitMQ.

**Climax:** Oren runs a verification checklist: SSO login works, RBAC restricts features correctly per role, group-scoped data visibility is confirmed (Northern users see only Northern data), the SAR gateway is ingesting test data, detections appear on the map, and OpenTelemetry dashboards show all services healthy.

**Resolution:** The deployment is operational. Oren hands off to the customer's technical operator for ongoing monitoring. Two weeks later, the customer requests a new group ("Maritime Sector") — Oren creates it in KeyCloak, assigns users, and the data scoping takes effect immediately without any code changes or redeployment.

**Edge case — Module update:** When a new version of the SAR module is released, Oren deploys it via Helm as an independent release — the core platform and other modules remain untouched and running.

**Requirements revealed:** Helm-based deployment, KeyCloak configuration (roles, groups, users), GeoServer data loading, gateway configuration, independent module deployment, system verification, no-code group management.

---

### 5.5 Journey 5: Technical Operator — System Health Monitoring & Incident Response

**Persona:** Yael, Technical Operator, responsible for a theater-scale deployment (50 users, 3 active sensor gateways)

**Opening Scene:** Yael monitors the OpenTelemetry/Grafana dashboards on her secondary screen throughout the operational day. Service health indicators are green across the Kubernetes cluster — all pods running, RabbitMQ queues processing normally, response times within baseline.

**Rising Action:** A latency spike appears on the Capella SAR gateway service. Yael drills into distributed tracing and sees that the gateway's external API calls to Capella are timing out intermittently. The queue depth for the SAR ingestion topic in RabbitMQ is growing. She checks the gateway pod logs via the centralized logging interface and confirms the external connectivity issue.

**Climax:** Yael determines the issue is external (Capella API intermittent availability), not internal. The system is degrading gracefully — other gateways and the SA application continue operating normally. SAR data will catch up once connectivity restores. She logs the incident, notes the affected time window, and communicates to the watch floor via the system status interface that SAR data may have gaps for the affected period.

**Resolution:** Connectivity restores 20 minutes later. The gateway automatically processes the backlog from RabbitMQ. Yael verifies through the tracing dashboard that latency returns to baseline and queue depth normalizes. She closes the incident. At no point did the SA application, chat, rule engine, or other gateways experience any disruption.

**Requirements revealed:** OpenTelemetry observability (traces, metrics, logs), Grafana dashboards, distributed tracing drill-down, centralized logging, RabbitMQ queue monitoring, graceful degradation visibility, system status communication, per-service isolation.

---

### 5.6 Journey 6: Intelligence Analyst — Attack Agent TCT Workflow (Demo Scenario)

**Persona:** Noa (same analyst from Journey 1), working a border tension scenario

**Opening Scene:** Intelligence has arrived about enemy weapon system components leaving a known fixed site. Noa's shift begins with SIGINT intercepts already displayed as entities on the Prophesee viewer — old intercepts layered over threatening areas and fixed sites. A Few Shots SAR comparison from IronBrain has detected component "departure" from the fixed site.

**Rising Action — Correlation:** Noa opens the chat window with the Correlation AI agent. She asks in natural language: "Were there SIGINT intercepts from the area of entities X, Y, Z in recent hours?" The agent responds with matching intercepts — a list of correlated SIGINT entities linked in the response. She clicks each entity and it highlights on the map with a tooltip showing ID, classification, intercept time, and associated intelligence. The agent performs semantic correlation of VISINT (SAR detections from IronBrain's ATC) and SIGINT data, creating correlated target entities that combine evidence from both sensor disciplines.

**Rising Action — RoE:** The external RoE evaluator automatically receives the correlated targets and assesses them against predefined Rules of Engagement. An alert pops up in the alerts window: targets approved for strike, with a causality explanation — referencing the current intelligence, confirming the targets are transmitting (active threat), and the area deployment pattern matches engagement criteria. Noa reviews the RoE recommendation at the HITL approval gate.

**Rising Action — Planning Aids:** Noa right-clicks each approved target and selects "Create planning aid." The system generates a planning aid entity containing the target image, coordinates, height, target family (TACA, launcher), and description. She reviews each aid, clicks "Approve," then "Send to planning" — which transmits the planning files to MSG's weaponeering system via the defined partner interface.

**Climax — Planning Approval:** MSG's weaponeering agent returns strike plans with weapon type, quantities, fuse delays, collateral damage (CDE), and risk levels (ALR). The Planning Approval AI agent evaluates these results against predefined parameters and generates a traffic-light assessment table for each target — green (suitable), yellow (caution), red (not suitable) — covering ALR, CDE, and approving authority level. An alert presents the recommendation to the commander for approval.

**Resolution:** The commander reviews the traffic-light table, approves the targets, and clicks "Send to strike." The approved targets flow to Omnisys for platform-to-target assignment, execution planning (flight path, threats, altitude, release point), and BDA collection planning. The entire sensor-to-shooter cycle — from SAR/SIGINT detection through weaponeering approval — completes within the Prophesee viewer with AI agents handling each stage autonomously, human operators approving at every decision gate.

**Requirements revealed:** AI agent chat interface (LLM-based), semantic correlation, entity-linked AI responses, external RoE evaluation interface, alert causality display, planning aids generation, partner system integration interfaces (IronBrain, MSG, Omnisys, RoE evaluator), traffic-light risk assessment display, HITL approval gates, demo data injection (JSON).

---

### 5.7 Journey Requirements Summary

| Capability Area | Revealed By Journeys |
|----------------|---------------------|
| Detection management (display, classify, affiliate, history) | 1, 2 |
| SAR exploitation tools (measurement, brightness/contrast, flicker) | 1 |
| Rule engine & alert management | 1, 2, 3, 6 |
| Real-time WebSocket push notifications | 2, 6 |
| Collaborative chat with data items & map pointers | 1, 2, 3 |
| AI agent chat interface (LLM-based correlation queries) | 6 |
| AI agents (Planning Aids, Planning Approval) | 6 |
| External RoE evaluation interface | 6 |
| Partner system integration (IronBrain, MSG, Omnisys, RoE evaluator) | 6 |
| Planning aids workflow & HITL approval gates | 6 |
| Traffic-light risk assessment display | 6 |
| Demo data injection (JSON-based) | 6 |
| Group-scoped data visibility | 1, 3, 4 |
| Map data filtering (by type, area) | 2 |
| Layer visibility control (show/hide, z-order) | 2, 6 |
| Information filter (by discipline, site, target) | 2 |
| Site management (create, priority, rule linking) | 3 |
| Movement trails & detection history | 2 |
| KeyCloak user/role/group administration | 4 |
| Helm-based deployment & independent module updates | 4 |
| GeoServer geospatial data management | 4 |
| Gateway configuration & verification | 4 |
| OpenTelemetry observability (traces, metrics, logs) | 5 |
| Graceful degradation & service isolation | 5 |
| System status communication | 5 |
| Large-format display support | 2 |
| Cesium 3D map interaction | 1, 2, 3, 6 |

## 6. Domain-Specific Requirements

### 6.1 Compliance & Standards

#### 6.1.1 Current (Phase 1+)

- **OGC Standards (WMS, WFS, WCS)** — Geospatial data interoperability via GeoServer; all map layers, imagery, and vector data served through OGC-compliant interfaces. **The application must communicate exclusively through OGC standards — no proprietary GeoServer APIs.** The sole exception is the Geospatial Data Loading Module (Phase 4), which may use GeoServer-specific REST API for data ingestion
- **OWASP Top 10** — Web application security baseline; validated across all frontend and API surfaces

#### 6.1.2 Phase 2

- **AIS (Automatic Identification System)** — Maritime vessel identification and tracking data; ingested via a dedicated AIS Gateway that translates AIS messages to the internal protobuf representation

#### 6.1.3 Future Phases (Phase 3+)

- **STANAG 4676** — NATO standard for motion imagery and track data; will be ingested via a dedicated gateway that translates to the internal protobuf representation
- **ASTERIX** — Eurocontrol surveillance data exchange standard; will be ingested via a dedicated gateway
- **NMEA** — Maritime positioning standard; will be ingested via a dedicated gateway

#### 6.1.4 Phase 4

- **Data Classification** — System must support classification category management; data handling must respect classification levels throughout the pipeline
- **Group-Based Data Scoping** — Users assigned to groups that scope data visibility by region or responsibility; enforced at the query layer

**Standards Integration Pattern:** Each external standard enters the system through a dedicated gateway that translates the standard-specific format into the system's internal Protocol Buffers representation. The core platform operates exclusively on protobuf-defined canonical data models. This pattern is active today for OGC (via GeoServer) and sensor data (via the Capella SAR gateway), and will be extended to AIS (Phase 2), STANAG, ASTERIX, and NMEA (Phase 3+) without architectural changes.

### 6.2 Internal Data Representation

- **Protocol Buffers (protobuf)** — All internal data models are defined as protobuf schemas
- **Dedicated Data Model Repository** — All `.proto` files are maintained in a single, dedicated repository that serves as the canonical source of truth for the system's data model
- **Service contracts** — All service-to-service communication (gRPC) uses the shared protobuf definitions from the Data Model repository
- **Gateway responsibility** — Each sensor/standard gateway translates external formats into the canonical protobuf data models; the core platform never handles raw external formats

### 6.3 Security Requirements

- **Authentication & Authorization** — KeyCloak SSO with RBAC; Tyk API Gateway validates JWT authentication and enforces role-based authorization on every inbound request; backend services validate JWT claims for defense-in-depth; group-based data scoping at query layer (Phase 4)
- **Encryption** — TLS in transit for all service-to-service and client-to-backend communication; encryption at rest for all persistent data stores
- **Audit Trail** — All user actions, data access, and system events must be logged for post-incident analysis and compliance auditing
- **Secrets Management** — HashiCorp Vault for all credentials, certificates, API keys, and encryption keys; no secrets in code or configuration files
- **Vulnerability Management** — Container image scanning, dependency vulnerability tracking, regular security assessment cycles

### 6.4 Deployment Architecture

- **Single-Cluster Deployment** — All Prophesee services run within a single Kubernetes cluster. The system communicates with external entities (partner systems, sensor feeds, external APIs) outside the cluster, but all platform services are co-located
- **Cluster Distribution Options:**
  - **K3S** — lightweight Kubernetes for tactical/small-scale deployments (5-10 users)
  - **Rancher** — managed Kubernetes for theater/medium-scale deployments (50-100 users)
  - **OpenShift** — enterprise Kubernetes for strategic/large-scale deployments (1000+ users)
- **Same codebase, different scale** — Deployment tier is determined by cluster size, which services are deployed, and which frontend modules are activated — not by code differences
- **External communication** — Sensor gateways, partner system interfaces (IronBrain, MSG, Omnisys, RoE evaluator), and external APIs communicate across cluster boundaries via defined network policies

### 6.5 Partner Integration Requirements

- **IronBrain** — SAR ATC (Few Shots SAR, Automatic Target Classification); interface specification for receiving ATC results and feeding them into the correlation pipeline
- **MSG** — Weaponeering system; interface for sending planning aids and receiving strike plans (weapon type, quantities, CDE, ALR)
- **Omnisys** — Tasking and BDA planning system; interface for sending approved targets and receiving execution plans and BDA collection plans
- **RoE Evaluator** — External Rules of Engagement evaluation system operated by a separate party; interface for sending correlated targets and receiving RoE assessment results with causality explanations. Development of the RoE evaluation logic is outside Prophesee scope — Prophesee provides the integration interface only
- **Interface Contracts** — Each partner integration requires a documented API contract, data format specification, error handling, and fallback behavior when partner systems are unavailable

### 6.6 Domain-Specific Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| OGC compliance gaps in GeoServer configuration | Geospatial data interoperability failures | Validate OGC compliance with standard-compliant WMS/WFS/WCS test clients early in integration |
| Protobuf schema evolution breaks services | Service incompatibility, data loss | Strict protobuf backward compatibility rules in the Data Model repository; versioned schemas |
| Partner system interface changes | Demo workflow breaks | Formal interface contracts with versioning; adapter pattern isolates partner changes from core |
| Classification level mismatch (Phase 4) | Data leak between classification levels | Enforce data classification at ingestion; group-based scoping validated at every query boundary |
| AI agent produces incorrect recommendation | Operational harm from wrong correlation/planning decision | HITL mandatory at every decision gate; agent outputs are recommendations, never autonomous actions |
| Real-time latency degradation under load | Missed alerts, stale operational picture | Load testing per deployment tier; performance budgets enforced; RabbitMQ back-pressure handling |
| K3S resource constraints in tactical deployment | Service instability on limited hardware | Resource profiling per deployment tier; minimum hardware specifications documented per tier |
| AIS data quality/reliability (Phase 2) | Incorrect correlation results | Correlation Service includes confidence scoring; manual verification workflow for low-confidence correlations |
| External RoE evaluator unavailability | Kill chain blocked at RoE stage | Adapter pattern with mock/stub interface; demo can run with pre-computed RoE results |

## 7. Innovation & Novel Patterns

### 7.1 Detected Innovation Areas

#### 7.1.1 AI Agent-Orchestrated Kill Chain

The Attack Agent Demo introduces autonomous AI agents at each stage of the TCT targeting workflow — correlation, planning aids, planning approval — each operating as a standalone microservice with mandatory HITL approval gates. The RoE evaluation stage is provided by an external partner through a defined interface. This is not traditional automation (rule-based scripting) but AI agent architecture applied to a complex multi-stage operational process where each agent reasons about its domain, produces recommendations with causality explanations, and defers to human judgment at decision points.

#### 7.1.2 Conversational Multi-INT Correlation

The Correlation Agent uses LLM-based conversational interaction through the chat system to perform semantic correlation of SIGINT and VISINT data. An analyst asks questions in natural language ("Were there SIGINT intercepts from the area of entity X in recent hours?") and receives entity-linked, map-correlated responses. This replaces manual cross-referencing of siloed sensor feeds with an AI-mediated conversational correlation workflow — a novel interaction pattern for intelligence analysis.

#### 7.1.3 Protobuf-Canonical Gateway Architecture

Prophesee's approach — protobuf schemas as the single source of truth in a dedicated Data Model repository, consumed by all services via gRPC, with each external data source entering exclusively through translation gateways — creates a uniquely rigorous separation between external data diversity and internal data uniformity. This pattern starts with sensor gateways (Capella SAR) and OGC (via GeoServer) in Phase 1, extends to AIS in Phase 2, and will accommodate military standards (STANAG, ASTERIX, NMEA) in future phases — all without architectural changes. This enables gateway development by separate teams without any knowledge of the core platform's internals.

#### 7.1.4 Multi-Partner Agent Composability

The Attack Agent Demo composes autonomous agents and external partner services from multiple organizations (Software Factory, IronBrain, MSG, Omnisys, RoE evaluator) into a unified operational workflow through defined interfaces. Each partner owns its domain-specific capability, the platform orchestrates the data flow between them, and the UI presents a seamless experience. This composability model — plug-in partner agents and services contributing to a shared operational process — is a differentiating integration pattern.

### 7.2 Validation Approach

| Innovation | Validation Method | Success Indicator |
|-----------|------------------|-------------------|
| AI Agent Kill Chain | Attack Agent Demo end-to-end execution | Full TCT workflow completes with scripted data; HITL gates function correctly; recommendations include accurate causality |
| Conversational Correlation | Scripted demo scenarios with known correct answers | Correlation Agent returns correct entity correlations; linked entities display correctly on map; analyst confirms results match expected correlation output |
| Protobuf-Canonical Gateway | Second gateway developed by separate team | New gateway team uses only the Data Model repository proto files to build a working gateway, without modifying core platform code |
| Multi-Partner Composability | Demo integration with all partner systems | Data flows between all partner agents/services through defined interfaces; workflow completes without manual intervention between stages |

### 7.3 Risk Mitigation

| Innovation Risk | Fallback Strategy |
|----------------|-------------------|
| LLM Correlation Agent produces incorrect correlations | Scripted/constrained responses for demo; production version requires confidence scoring and validation against known ground truth |
| AI agent recommendations are unreliable for planning decisions | HITL is mandatory (not optional) at every gate; agent outputs are advisory only; system never takes autonomous lethal action |
| Partner interface instability (including external RoE evaluator) | Adapter pattern with mock/stub interfaces for each partner; demo can run in "disconnected partner" mode with pre-loaded results |
| Protobuf schema evolution breaks backward compatibility | Strict versioning rules, CI validation of backward compatibility on every PR to the Data Model repository |

## 8. Web Application & Enterprise Platform Requirements

### 8.1 Project-Type Overview

Prophesee is a hybrid **Web Application (SPA)** and **Enterprise B2B Platform** — a Cesium/React Module Federation single-page application using **Material Design (MUI)** as the design system, serving as the unified interface for a C4ISR situational awareness system. It is deployed as a **single-tenant** application per customer, on dedicated Kubernetes infrastructure, with **Chromium-only** browser support. The platform combines real-time geospatial visualization (SPA concerns) with enterprise-grade RBAC, multi-role operations, and partner system integrations (B2B platform concerns).

### 8.2 Browser Support Matrix

| Browser | Support Level | Action |
|---------|--------------|--------|
| Chromium-based (Chrome, Edge, Brave, Chromium) | **Fully Supported** | Full application loads and operates |
| All others (Firefox, Safari, IE, Opera) | **Not Supported** | Display error message; application does not load |

**Implementation:**
- Browser detection at application entry point (user-agent and feature detection)
- Non-Chromium browsers receive a clear error page explaining the requirement, with no application bundle loaded
- Target Chromium version: aligned with the latest ESR/stable channel available in the deployment environment (defense environments may lag behind consumer releases)

### 8.3 Responsive Design & Display Targets

| Display Type | Priority | Key Considerations |
|-------------|----------|-------------------|
| Desktop workstation (1920x1080 and above) | **Primary** | Full layout — map, panels, chat, alerts all visible simultaneously |
| Large-format display / multi-monitor | **Primary** | Optimized for watch floor use; dense information display; map-dominant layout |
| Tablet / touch screen | **Secondary** | Touch-friendly controls; larger tap targets; simplified layout; field/mobile use cases |

**Design Principles:**
- **Material Design (MUI)** — the UI framework uses Material Design via MUI as the primary design system, ensuring consistent visual language, interaction patterns, and component library across all federated modules
- **Style adaptation architecture** — the UI framework must support deployment-specific theming (color schemes, layouts, branding) without code changes, accommodating different customer deployment scenarios; MUI theming system provides this capability
- **Touch support** — all primary interactions (map navigation, detection selection, alert acknowledgment) must be operable via touch input on tablet-class devices
- **No mobile-first** — the application is designed for desktop/large-screen primary use; tablet support is secondary and may offer a reduced feature set

### 8.4 Performance Targets

| Metric | Target | Context |
|--------|--------|---------|
| Initial load (Chromium, cached) | < 5 seconds | Module Federation shell + initial SA module |
| Map render (Cesium 3D globe) | 60 FPS sustained | During pan/zoom/rotate on standard workstation hardware |
| WebSocket event-to-render | Immediate (< 1 second) | Detection and alert display from gateway ingestion to screen |
| Concurrent users per deployment | Scales with tier | K3S: 5-10, Rancher: 50-100, OpenShift: 1000+ |
| Module lazy load | < 2 seconds | Any federated module loads on-demand without blocking the shell |
| Memory footprint | Stable over 8-hour shift | No memory leaks during sustained operational use (watch floor sessions) |

### 8.5 Tenant Model

- **Single-tenant deployment** — each customer receives a dedicated deployment on their own Kubernetes cluster
- **No multi-tenant infrastructure sharing** — data isolation is physical (separate clusters), not logical
- **Customer-specific configuration** — each deployment can have different:
  - Deployed modules (which sensor gateways, which capability modules)
  - Cluster distribution (K3S / Rancher / OpenShift)
  - KeyCloak realm configuration (roles, groups, users)
  - GeoServer layers and geospatial data
  - Partner system integrations (which external systems are connected)
- **Operational independence** — customer deployments are fully independent; one customer's deployment has no dependency on or awareness of any other

### 8.6 RBAC & Permission Matrix

A **Role** defines a set of features (capabilities) available to the user. Each feature in the system maps to one or more roles that can access it. Roles are managed in KeyCloak and propagated to the system via JWT claims. Each feature has a unique **feature code** (acronym) used in KeyCloak's feature permission matrix and embedded in the JWT token.

#### 8.6.1 Feature-to-Role Mapping

| Feature / Capability | Code | Intelligence Analyst | SA Operator | Commander | Technical Operator | System Administrator |
|---------------------|------|:-------------------:|:-----------:|:---------:|:-----------------:|:-------------------:|
| **Map & Geospatial** | | | | | | |
| View map, navigate, zoom/pan | MAP_NAV | Yes | Yes | Yes | Yes | — |
| View detections on map | MAP_DET | Yes | Yes | Yes | Yes | — |
| View movement trails | MAP_TRAIL | Yes | Yes | Yes | — | — |
| Create map annotations | MAP_ANNOT | Yes | Yes | — | — | — |
| Filter map display (by type, area) | MAP_FILTER | Yes | Yes | Yes | — | — |
| Layer visibility control (show/hide, z-order) | MAP_LAYERS | Yes | Yes | Yes | — | — |
| **Detection Management** | | | | | | |
| View detection list & details | DET_VIEW | Yes | Yes | Yes | View only | — |
| Classify detections | DET_CLASS | Yes | — | — | — | — |
| Affiliate detections | DET_AFFIL | Yes | — | — | — | — |
| Filter detections | DET_FILTER | Yes | Yes | Yes | — | — |
| View detection history | DET_HIST | Yes | Yes | Yes | — | — |
| **Sites Management** | | | | | | |
| Create/edit/delete sites | SITE_MGMT | Yes | — | — | — | Yes |
| View sites on map | SITE_VIEW | Yes | Yes | Yes | — | — |
| Set site priority | SITE_PRIO | — | — | Yes | — | — |
| Link rule presets to sites | SITE_RULE | Yes | — | — | — | Yes |
| **Rule Engine & Alerting** | | | | | | |
| View alerts | ALERT_VIEW | Yes | Yes | Yes | System alerts only | — |
| Acknowledge alerts | ALERT_ACK | Yes | Yes | — | — | — |
| Investigate alerts (drill-down) | ALERT_INV | Yes | — | — | — | — |
| Escalate alerts | ALERT_ESC | — | Yes | — | — | — |
| Review/approve escalated alerts | ALERT_APPR | — | — | Yes | — | — |
| Create/edit/delete rule presets | RULE_MGMT | — | — | — | — | Yes |
| **Collaborative Chat** | | | | | | |
| Send/receive messages | CHAT_MSG | Yes | Yes | Yes | Limited | — |
| Share data items in chat | CHAT_DATA | Yes | Yes | Yes | — | — |
| Share map pointers | CHAT_PTR | Yes | Yes | Yes | — | — |
| Attach files | CHAT_FILE | Yes | Yes | Yes | — | — |
| **AI Agent Workflow** | | | | | | |
| Query Correlation Agent via chat | AGENT_CORR | Yes | — | — | — | — |
| Review RoE recommendations (HITL) | ROE_REVIEW | Yes | — | — | — | — |
| Create planning aids | AGENT_PLAN | Yes | — | — | — | — |
| Approve/send planning aids | AGENT_SEND | Yes | — | — | — | — |
| Review traffic-light assessments | AGENT_TL | — | — | Yes | — | — |
| Approve/reject targets (HITL) | AGENT_APPR | — | — | Yes | — | — |
| Monitor agent alerts | AGENT_MON | Yes | Yes | — | — | — |
| **SAR Exploitation** | | | | | | |
| Browse SAR image catalog | SAR_BROWSE | Yes | Yes | — | — | — |
| Overlay SAR images on map | SAR_OVERLAY | Yes | Yes | — | — | — |
| Adjust brightness/contrast | SAR_ADJUST | Yes | — | — | — | — |
| Measure on SAR imagery | SAR_MEASURE | Yes | — | — | — | — |
| Flicker comparison | SAR_FLICKER | Yes | — | — | — | — |
| View histogram | SAR_HISTO | Yes | — | — | — | — |
| **Administration** | | | | | | |
| Manage users/roles/groups (KeyCloak) | ADMIN_USERS | — | — | — | — | Yes |
| Deploy/update modules (Helm) | ADMIN_DEPLOY | — | — | — | — | Yes |
| Configure gateways | ADMIN_GW | — | — | — | — | Yes |
| Manage GeoServer layers (Phase 4) | ADMIN_GEO | — | — | — | — | Yes |
| System health dashboards | OPS_HEALTH | — | — | — | Yes | Yes |
| Distributed tracing & logs | OPS_TRACE | — | — | — | Yes | — |
| System status & diagnostics | OPS_STATUS | — | — | — | Yes | — |

**"Yes"** = feature is enabled and visible. **"—"** = feature is hidden from the UI and blocked at the API level.

#### 8.6.2 Permission Enforcement Architecture

- **KeyCloak** manages all roles, groups, and user assignments. Each user's JWT token contains their role(s), group membership(s), and **permitted feature codes** as claims. KeyCloak **Protocol Mappers** are configured to embed the list of feature permission codes (from the Feature-to-Role Mapping table above) directly into the JWT token, so both the frontend and backend can read the user's allowed features from the token without additional lookups
- **Tyk API Gateway** intercepts every client-to-backend request, validates the JWT token (authentication), and enforces authorization by checking the user's role claims against the endpoint's required permissions — requests that fail authentication or authorization are rejected before reaching backend services
- **Backend services** validate JWT claims at the service boundary for defense-in-depth; group-based data scoping is enforced as query filters at the data layer, not at the UI level (Phase 4)
- **Frontend** reads the user's role and **permitted feature codes** from the JWT token and **enables, disables, or hides** UI features accordingly:
  - **Enabled** — feature is fully interactive for the user's role
  - **Disabled** — feature is visible but non-interactive (greyed out), used when the user needs awareness of the capability but lacks permission
  - **Hidden** — feature is completely removed from the UI, used when the role has no relevance to the capability
- Frontend feature gating is a UX convenience only — authorization is always enforced server-side via Tyk and backend JWT validation

### 8.7 Integration List

| Integration | Type | Protocol | Direction | Purpose |
|------------|------|----------|-----------|---------|
| KeyCloak | Identity & Access | OIDC/JWT | Bidirectional | SSO, RBAC, group management; JWT includes role + feature permission codes via Protocol Mappers |
| GeoServer | Geospatial | OGC (WMS/WFS/WCS) only | Read | Base maps, imagery layers, vector data — **application uses only OGC standard interfaces; no proprietary GeoServer API** |
| RabbitMQ | Message Bus | AMQP | Internal | Data distribution, event streaming |
| Redis | Distributed Cache | Redis Protocol | Internal | Common runtime data sharing and caching across services |
| PostgreSQL/PostGIS | Relational Database | SQL | Internal | Relational data management, geospatial queries |
| MongoDB | Document Database | MongoDB Wire Protocol | Internal | Non-relational data storage |
| MinIO | Object Storage | S3 API | Internal | Secure file and object storage with presigned URL access |
| Consul | Service Discovery | HTTP/DNS | Internal | Service registration and health |
| Vault | Secrets Management | HTTP | Internal | Credentials, certificates, keys |
| Tyk | API Gateway | HTTP/REST | Inbound | API gateway for client-to-backend traffic — validates JWT authentication, enforces role-based authorization against JWT claims, rate limiting, routing |
| Capella SAR | Sensor Gateway | gRPC (protobuf) | Inbound | SAR imagery and detections |
| IronBrain | Partner — ATC | Defined interface | Bidirectional | SAR ATC processing, Few Shots SAR |
| MSG | Partner — Weaponeering | Defined interface | Bidirectional | Strike planning, CDE/ALR assessment |
| Omnisys | Partner — Tasking | Defined interface | Outbound | Target tasking, BDA collection planning |
| RoE Evaluator | Partner — RoE | Defined interface | Bidirectional | External Rules of Engagement evaluation; sends correlated targets, receives RoE assessments (developed by external party) |
| Prometheus + Grafana | Observability — Metrics | OTLP / PromQL | Internal | Metrics collection, dashboards, alerting |
| OpenTelemetry Collector | Observability — Tracing & Logs | OTLP | Outbound | Distributed traces and centralized logs |

### 8.8 Compliance Requirements (Platform-Level)

| Requirement | Scope | Implementation |
|------------|-------|----------------|
| OWASP Top 10 | All web surfaces | Validated during security assessment cycles |
| Data classification handling (Phase 4) | All data pipelines | Classification enforced at ingestion; respected through storage and display |
| Audit logging | All user and system actions | Immutable audit trail for compliance and post-incident review |
| Encryption in transit | All communication | TLS everywhere — service-to-service, client-to-backend, external interfaces |
| Encryption at rest | All persistent stores | Database-level encryption for PostgreSQL/PostGIS; object storage encryption |
| Secrets management | All credentials | Vault-managed; zero secrets in code or config files |

### 8.9 Implementation Considerations

#### 8.9.1 Module Federation Architecture

- WebKit (github.com/mayafit/WebKit) serves as the mandatory shell application
- Each capability domain (SA, SAR, chat, rules, AI agents) is a separately built and deployed federated module
- Modules share a common Material Design (MUI) design system for consistent UX, but are independently versioned and releasable
- Style adaptation (theming) must be implemented at the MUI theme level so all modules inherit deployment-specific styling

#### 8.9.2 Material Design (MUI)

- MUI (Material UI) is the standard component library and design system for all frontend modules
- All federated modules must use MUI components to ensure visual consistency across the application
- Custom MUI theme configuration provides deployment-specific branding, color schemes, and typography
- MUI's responsive layout utilities support desktop-primary design with large-format display optimization

#### 8.9.3 GeoServer OGC Abstraction

- **The application must communicate with GeoServer exclusively through OGC standard interfaces (WMS, WFS, WCS)** — no proprietary GeoServer REST API calls from application code
- Layer discovery uses WMS GetCapabilities; layer rendering uses WMS GetMap; feature queries use WFS GetFeature
- This abstraction enables future replacement of GeoServer with any OGC-compliant geospatial server without application changes
- The **Geospatial Data Loading Module** (Phase 4) is the sole exception — it may use GeoServer-specific REST API for ingesting, configuring, and managing layers server-side
- Phase 1 provides a **Layer Visibility Control** UI (tree-like layer display retrieved via WMS GetCapabilities, checkboxes for show/hide, and z-order reordering) — this operates entirely through OGC standards

#### 8.9.4 Chromium-Only Optimizations

- Can leverage Chromium-specific APIs without cross-browser polyfills
- WebGL2 / WebGPU for Cesium rendering without fallback concerns
- Web Workers / SharedArrayBuffer for computation-heavy tasks (geospatial processing)
- Service Workers for offline-resilient asset caching (not full offline mode)

#### 8.9.5 Touch & Tablet Considerations

- Map interaction layer must support both mouse+keyboard and touch gesture input
- Context menus (e.g., right-click → "Create planning aid") need touch-accessible alternatives
- Detection selection and alert acknowledgment must work with finger-sized tap targets
- Layout should adapt to tablet screen sizes while maintaining operational usability

#### 8.9.6 Single-Tenant Deployment Implications

- No need for tenant isolation logic in application code — isolation is infrastructure-level
- Customer-specific configuration managed via Helm values and KeyCloak realm setup
- Simplifies data architecture — no tenant ID in every table, no tenant-aware query scoping
- Each deployment can run different versions of modules (customers can be on different release tracks)

## 9. Functional Requirements

### 9.1 Map & Geospatial Visualization

- **FR1:** Users can view a 3D globe with base map layers rendered via Cesium
- **FR2:** Users can pan, zoom, rotate, and navigate the map using mouse, keyboard, or touch input
- **FR3:** Users can view detections displayed on the map as entities with color-coding by affiliation (friendly, hostile, unknown, neutral)
- **FR4:** Users can click a detection on the map to view its metadata in a detail panel
- **FR5:** Users can view movement trails for entities over a configurable time window
- **FR6:** Users can jump to specific coordinates using coordinate input
- **FR7:** Users can switch between coordinate systems
- **FR8:** Users can use measurement tools on the map (distance, area)
- **FR9:** Users can create and view map annotations
- **FR10:** Users can replay historical data on the map using a timeline control
- **FR11:** Users can filter entities displayed on the map by type (sensor discipline, entity category, affiliation)
- **FR12:** Users can filter entities displayed on the map by geographic area (draw or select a boundary to show only entities within that region)
- **FR13:** Users can view a tree-like layer visibility control displaying all available geospatial layers (retrieved via WMS GetCapabilities)
- **FR14:** Users can show or hide individual geospatial layers on the map via checkboxes in the layer visibility control
- **FR15:** Users can change the z-order (rendering order) of geospatial layers on the map by reordering layers in the layer visibility control (move a layer above or below another)

### 9.2 Detection Management

- **FR16:** Users can view detections in both map view and tabular list view
- **FR17:** Intelligence Analysts can classify detections (assign classification categories)
- **FR18:** Intelligence Analysts can affiliate detections to entities (friendly, hostile, unknown, neutral)
- **FR19:** Users can view detection history and change logs
- **FR20:** Users can filter detections by discipline, site, affiliation, time range, and other attributes
- **FR21:** The system can ingest detections from sensor gateways via the protobuf canonical data model and display them in real time

### 9.3 Sites Management

- **FR22:** Users can create, edit, and delete polygon-based sites on the map
- **FR23:** Users can assign parameters and metadata to sites
- **FR24:** Users can link rule presets to sites
- **FR25:** Users can view sites on the map with visual styling by affiliation
- **FR26:** Commanders can set site priority levels

### 9.4 Rule Engine & Alerting

- **FR27:** System Administrators can create, edit, and delete rule presets using the Rule Engine Service (Microsoft RulesEngine)
- **FR28:** Users can assign rule presets to specific sites
- **FR29:** The Rule Engine can evaluate incoming sensor data against active rule presets and generate alerts automatically
- **FR30:** Users can view alerts in a dedicated alert panel with priority-based ordering
- **FR31:** SA Operators can acknowledge and escalate alerts
- **FR32:** Intelligence Analysts can investigate alerts (drill down to triggering detection and site)
- **FR33:** Commanders can review and approve/reject escalated alerts
- **FR34:** The system can deliver alerts to users immediately via WebSocket push notifications

### 9.5 Collaborative Chat

- **FR35:** Users can send and receive one-to-one messages
- **FR36:** Users can send and receive one-to-many (group/channel) messages
- **FR37:** Users can share data items (detections, sites, alerts) in chat messages
- **FR38:** Users can share map pointers (coordinates with context) in chat messages
- **FR39:** Users can attach files to chat messages
- **FR40:** Users can interact with AI agents through the chat interface using natural language

### 9.6 AI Agent Kill Chain (Attack Agent Demo)

- **FR41:** The system can ingest demo scenario data via JSON-based data injection simulating SAR and SIGINT sensor feeds
- **FR42:** The system can receive ATC (Automatic Target Classification) results from IronBrain and display them as detections
- **FR43:** Intelligence Analysts can query the Correlation Agent via chat to correlate multi-INT data (VISINT + SIGINT) semantically
- **FR44:** The Correlation Agent can return entity-linked responses that highlight correlated entities on the map
- **FR45:** The system can send correlated targets to the external RoE evaluator and receive RoE assessment results with causality explanations
- **FR46:** The system can display RoE assessment results as alerts with causality explanations for analyst review at a HITL approval gate
- **FR47:** Intelligence Analysts can create planning aids from approved targets (containing target image, coordinates, height, target family, description)
- **FR48:** Intelligence Analysts can review and approve planning aids, then send them to MSG's weaponeering system
- **FR49:** The system can receive strike plans from MSG (weapon type, quantities, fuse delays, CDE, ALR)
- **FR50:** The Planning Approval Agent can evaluate strike plans and generate a traffic-light assessment (green/yellow/red) for ALR, CDE, and approving authority
- **FR51:** Commanders can review traffic-light assessments at a HITL approval gate and approve or reject targets for strike
- **FR52:** The system can send approved targets to Omnisys for platform-to-target assignment and execution planning
- **FR53:** The system can receive BDA collection plans from Omnisys
- **FR54:** Each AI agent stage and external partner evaluation stage enforces a mandatory HITL approval gate before proceeding to the next stage

### 9.7 SAR Exploitation

- **FR55:** Users can browse and search a catalog of SAR images by area, time, and metadata
- **FR56:** Users can overlay SAR images on the map
- **FR57:** Intelligence Analysts can adjust SAR image display (brightness, contrast)
- **FR58:** Intelligence Analysts can use measurement tools on SAR imagery
- **FR59:** Intelligence Analysts can perform flicker comparison between SAR images of the same area at different times
- **FR60:** Intelligence Analysts can view histogram data for SAR images

### 9.8 Identity, Access & Data Scoping

- **FR61:** Users can authenticate via KeyCloak SSO (single sign-on)
- **FR62:** Tyk API Gateway validates JWT authentication and enforces role-based authorization on every client-to-backend request — rejecting unauthorized requests before they reach backend services
- **FR63:** Each role defines a set of system features (capabilities) the user can access, as specified in the Feature-to-Role Mapping matrix; each feature has a unique feature code used in KeyCloak and the JWT token
- **FR64:** KeyCloak embeds the user's role(s) and permitted feature codes in the JWT token via Protocol Mappers; the frontend reads permitted features from the token and enables, disables, or hides UI features accordingly — server-side authorization via Tyk and backend JWT validation is always enforced regardless of frontend state
- **FR65:** Users are assigned to groups that scope their data visibility by region or responsibility (Phase 4)
- **FR66:** Users with no group assignment can view all data (Phase 4)
- **FR67:** Users can belong to multiple groups simultaneously (Phase 4)
- **FR68:** System Administrators can manage users, roles, and groups through KeyCloak
- **FR69:** The system logs all user actions, data access, and system events to an immutable audit trail

### 9.9 Platform Infrastructure & Operations

- **FR70:** System Administrators can deploy the platform using Helm charts on Kubernetes (K3S, Rancher, or OpenShift)
- **FR71:** System Administrators can deploy and update individual modules independently without affecting other modules
- **FR72:** System Administrators can configure sensor gateway connections and verify data flow
- **FR73:** System Administrators can manage geospatial base layers and reference data via GeoServer
- **FR74:** Technical Operators can monitor system health via Prometheus/Grafana dashboards
- **FR75:** Technical Operators can trace requests across services using OpenTelemetry distributed tracing
- **FR76:** Technical Operators can view centralized logs from all services
- **FR77:** Technical Operators can view RabbitMQ queue depth and processing status
- **FR78:** The system communicates a system status to watch floor users when services are degraded
- **FR79:** The system degrades gracefully when individual gateways or services are unavailable (other services continue operating)
- **FR80:** The system manages all secrets (credentials, certificates, keys) through Vault with no secrets in code or configuration
- **FR81:** The system stores and retrieves files (SAR images, planning aids, attachments, reports) via MinIO object storage with secure presigned URL access

### 9.10 Partner System Integration

- **FR82:** The system can exchange data with IronBrain (SAR ATC) via a defined interface contract
- **FR83:** The system can exchange data with MSG (weaponeering) via a defined interface contract
- **FR84:** The system can exchange data with Omnisys (tasking/BDA) via a defined interface contract
- **FR85:** The system can exchange data with the external RoE evaluator via a defined interface contract (sending correlated targets, receiving RoE assessments with causality)
- **FR86:** Each partner integration operates through an adapter pattern that isolates partner interface changes from core platform logic
- **FR87:** The system can operate with mock/stub partner interfaces when partner systems are unavailable

## 10. Non-Functional Requirements

### 10.1 Performance

| NFR | Requirement | Measurement |
|-----|------------|-------------|
| NFR-P1 | Alert delivery from gateway ingestion to operator notification | Immediate — real-time via WebSocket push, no perceptible delay |
| NFR-P2 | Detection display from sensor ingestion to map rendering | < 1 second end-to-end latency |
| NFR-P3 | Map rendering frame rate during navigation | 60 FPS sustained on standard workstation hardware |
| NFR-P4 | Application initial load (cached, Chromium) | < 5 seconds to interactive shell with SA module |
| NFR-P5 | Federated module lazy load | < 2 seconds per module on demand |
| NFR-P6 | Chat message delivery (user-to-user and agent responses) | < 1 second for message delivery; agent responses within LLM processing time |
| NFR-P7 | Rule Engine evaluation cycle | Rule evaluation completes within 1 second of triggering data arrival |
| NFR-P8 | Memory stability during extended sessions | No memory leaks; stable footprint over 8-hour watch floor shifts |
| NFR-P9 | Map entity rendering capacity | Support rendering 10,000+ simultaneous entities on the Cesium globe without frame rate degradation |

### 10.2 Security

| NFR | Requirement | Measurement |
|-----|------------|-------------|
| NFR-S1 | Authentication enforcement | 100% of API endpoints require valid JWT; no unauthenticated access to any system resource |
| NFR-S2 | Authorization granularity | RBAC enforced at every service boundary; role permissions validated per request via JWT feature codes, not cached |
| NFR-S3 | Data scoping enforcement (Phase 4) | Group-based data visibility enforced at the query layer; no client-side-only filtering |
| NFR-S4 | Encryption in transit | TLS 1.2+ for all communication — service-to-service (gRPC/mTLS), client-to-backend (HTTPS), external interfaces |
| NFR-S5 | Encryption at rest | AES-256 or equivalent for all persistent data stores (PostgreSQL, MongoDB, object storage) |
| NFR-S6 | Secrets management | Zero secrets in code, configuration files, or container images; all secrets managed through Vault |
| NFR-S7 | Audit trail completeness | Every user action, data access, authentication event, and system configuration change logged with timestamp, actor, and action detail |
| NFR-S8 | Vulnerability management | No known critical/high CVEs in production container images; dependency scanning in CI pipeline |
| NFR-S9 | OWASP compliance | All web-facing surfaces validated against OWASP Top 10; XSS, CSRF, injection prevention verified |
| NFR-S10 | Session management | JWT token expiry enforced; refresh token rotation; session invalidation on logout propagated across services |

### 10.3 Scalability

| NFR | Requirement | Measurement |
|-----|------------|-------------|
| NFR-SC1 | Deployment tier scaling | Same codebase supports K3S (5-10 users), Rancher (50-100 users), OpenShift (1000+ users) — differentiated by cluster resources and deployed services |
| NFR-SC2 | Horizontal service scaling | Stateless services scale horizontally by adding pod replicas without code changes |
| NFR-SC3 | Message bus throughput | RabbitMQ handles peak sensor data rates for all active gateways without message loss or queue saturation |
| NFR-SC4 | Database scalability | PostgreSQL/PostGIS supports the data volume for the deployment tier without query performance degradation |
| NFR-SC5 | Cache scalability | Redis handles concurrent read/write from all services without becoming a bottleneck |

### 10.4 Reliability & Availability

| NFR | Requirement | Measurement |
|-----|------------|-------------|
| NFR-R1 | System availability | 99.9% uptime for core SA services (map, detections, alerts) |
| NFR-R2 | Service isolation | Failure of any single service (gateway, agent, chat) does not cascade to other services |
| NFR-R3 | Data durability | Zero data loss during service restarts, pod rescheduling, or node failures |
| NFR-R4 | Automatic recovery | Kubernetes health checks detect and restart failed services within 60 seconds |
| NFR-R5 | Graceful degradation | System remains operational with reduced capability when individual gateways or partner systems are unavailable |
| NFR-R6 | Message persistence | RabbitMQ messages survive broker restart; no data loss in the event pipeline |
| NFR-R7 | Partner system resilience | Partner system unavailability (IronBrain, MSG, Omnisys, RoE evaluator) does not block core platform operation; mock/stub fallback available |

### 10.5 Observability

| NFR | Requirement | Measurement |
|-----|------------|-------------|
| NFR-O1 | Distributed tracing coverage | 100% of service-to-service calls traced via OpenTelemetry; trace ID propagated across the full request chain |
| NFR-O2 | Metrics collection | All services expose Prometheus metrics (request rate, latency, error rate, saturation) |
| NFR-O3 | Log centralization | All service logs aggregated to a central store with structured format, searchable within 30 seconds of emission |
| NFR-O4 | Health dashboard | Grafana dashboards provide real-time visibility into service health, RabbitMQ queues, database connections, and gateway status |
| NFR-O5 | Alerting (system-level) | Prometheus alerting rules detect service degradation and notify Technical Operators within 1 minute |

### 10.6 Maintainability & Deployability

| NFR | Requirement | Measurement |
|-----|------------|-------------|
| NFR-M1 | Independent module deployment | Any federated frontend module or backend service can be deployed independently without requiring deployment of other components |
| NFR-M2 | Protobuf backward compatibility | Schema changes in the Data Model repository must maintain backward compatibility; CI validates on every PR |
| NFR-M3 | Infrastructure as code | All deployment configuration managed via Helm charts; manual cluster configuration limited to initial setup |
| NFR-M4 | Service discoverability | All services self-register with Consul; no hardcoded service addresses |
| NFR-M5 | API versioning | Tyk API Gateway supports API version management; breaking changes require new version |
| NFR-M6 | Build reproducibility | All services build deterministically from source; container images tagged with git commit hash |

### 10.7 Integration Reliability

| NFR | Requirement | Measurement |
|-----|------------|-------------|
| NFR-I1 | Partner interface contracts | Each partner integration (IronBrain, MSG, Omnisys, RoE evaluator) has a versioned interface contract; changes require formal agreement |
| NFR-I2 | Interface timeout handling | All external calls (partner systems, sensor gateways) have configurable timeouts with fallback behavior |
| NFR-I3 | Data format validation | All incoming data validated against protobuf schemas at ingestion; malformed data rejected with logging, not silently dropped |
| NFR-I4 | Gateway independence | Each sensor gateway operates independently; one gateway's failure does not affect other gateways |

## 11. Development Timetable

All timelines are relative to ARO (After Receipt of Order).

| Phase | Description | Duration | Timeline | Key Deliverables |
|-------|------------|----------|----------|-----------------|
| **Phase 1** | Platform Demo MVP | 8 weeks | ARO → ARO+8 | Attack Agent Demo end-to-end, core SA application (map, detections, alerts, chat, sites, rule engine, layer visibility control), KeyCloak RBAC, infrastructure foundation, basic observability, map data filtering |
| **Phase 2** | Operational SA Platform | TBD | ARO+8 → TBD | Live Capella SAR Gateway, SCD algorithm, AIS Gateway, Correlation Service, SAR exploitation tools, admin functions |
| **Phase 3** | Expanded Sensors & Intelligence Production | TBD | TBD | STANAG 4676 / ASTERIX / NMEA gateways, additional sensor gateways (SIGINT/ELINT, EO/IR, FMV), intelligence reports, touch/tablet optimization |
| **Phase 4** | AI/ML, Data Governance & Enterprise Scale | TBD | TBD | Big Data / ETL stack, ML pipeline, AI/LLM chatbot, data classification, group-based data scoping, GeoServer layer management tool, geospatial data loading module, multi-classification support, strategic-scale deployments, coalition operations |

**Phase 1 Milestone Breakdown:**

| Week | Focus Area | Deliverables |
|------|-----------|-------------|
| ARO → ARO+2 | Infrastructure & Foundation | K8s cluster, Helm charts, KeyCloak SSO + RBAC, Tyk, RabbitMQ, Consul, Vault, Redis, PostgreSQL, MongoDB, MinIO, Prometheus/Grafana, protobuf data model repository |
| ARO+2 → ARO+4 | Core SA Baseline | WebKit Module Federation shell (MUI), Cesium 3D map with data filtering and layer visibility control, detection management, basic alerting, chat system, sites management |
| ARO+4 → ARO+6 | AI Agent Chain (Part 1) | Demo data injection, ATC integration (IronBrain), Correlation Agent, external RoE evaluator interface, HITL approval gates, rule engine service |
| ARO+6 → ARO+8 | AI Agent Chain (Part 2) & Integration | Planning Aids, MSG weaponeering interface, Planning Approval Agent, Omnisys tasking interface, end-to-end demo validation |

## 12. Abbreviations

| Abbreviation | Full Term |
|-------------|-----------|
| AES | Advanced Encryption Standard |
| AIS | Automatic Identification System |
| ALR | Acceptable Level of Risk |
| AMQP | Advanced Message Queuing Protocol |
| ARO | After Receipt of Order |
| ASTERIX | All Purpose Structured Eurocontrol Surveillance Information Exchange |
| ATC | Automatic Target Classification |
| BDA | Battle Damage Assessment |
| C4ISR | Command, Control, Communications, Computers, Intelligence, Surveillance, and Reconnaissance |
| CCD | Coherent Change Detection |
| CDE | Collateral Damage Estimation |
| CI | Continuous Integration |
| CSRF | Cross-Site Request Forgery |
| CVE | Common Vulnerabilities and Exposures |
| DNS | Domain Name System |
| EO/IR | Electro-Optical / Infrared |
| ESR | Extended Support Release |
| ETL | Extract, Transform, Load |
| FMV | Full Motion Video |
| FPS | Frames Per Second |
| FR | Functional Requirement |
| gRPC | gRPC Remote Procedure Call |
| HITL | Human-in-the-Loop |
| HTTP/HTTPS | Hypertext Transfer Protocol / Secure |
| InSAR | Interferometric Synthetic Aperture Radar |
| ISR | Intelligence, Surveillance, and Reconnaissance |
| JWT | JSON Web Token |
| K3S | Lightweight Kubernetes Distribution |
| K8s | Kubernetes |
| KPI | Key Performance Indicator |
| LLM | Large Language Model |
| ML | Machine Learning |
| mTLS | Mutual Transport Layer Security |
| MUI | Material UI (Material Design component library) |
| Multi-INT | Multi-Intelligence (multiple intelligence disciplines) |
| MVP | Minimum Viable Product |
| NFR | Non-Functional Requirement |
| NMEA | National Marine Electronics Association |
| OGC | Open Geospatial Consortium |
| OIDC | OpenID Connect |
| OTLP | OpenTelemetry Protocol |
| OWASP | Open Web Application Security Project |
| PRD | Product Requirements Document |
| PromQL | Prometheus Query Language |
| RBAC | Role-Based Access Control |
| RoE | Rules of Engagement |
| SA | Situational Awareness |
| SAR | Synthetic Aperture Radar |
| SCD | Scene Change Detection |
| SIGINT | Signals Intelligence |
| SPA | Single-Page Application |
| SQL | Structured Query Language |
| SSO | Single Sign-On |
| STANAG | Standardization Agreement (NATO) |
| TCT | Time-Critical Targeting |
| TLS | Transport Layer Security |
| VISINT | Visual Intelligence |
| WCS | Web Coverage Service |
| WebGL | Web Graphics Library |
| WebGPU | Web Graphics Processing Unit API |
| WFS | Web Feature Service |
| WMS | Web Map Service |
| XSS | Cross-Site Scripting |
