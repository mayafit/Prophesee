---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments:
  - docs/STARLIGHT_System_Requirements_v2.md
  - docs/castodio.md
  - docs/architecture.MD
  - docs/HLD.drawio
  - docs/Attack_Agent_Demo_System_Specification.md
date: 2026-02-22
author: Alon
---

# Product Brief: Prophesee

## Executive Summary

Prophesee (working name) is a next-generation Multi-INT C4ISR situational awareness and intelligence platform, designed as a modernization of a legacy intelligence system. Built on a cloud-native, microservices architecture with a modern Cesium/React web frontend, Prophesee transforms vast volumes of multi-disciplinary ISR sensor data into actionable intelligence and real-time situational awareness.

The platform is architected for maximum flexibility and versatility through a sensor-agnostic gateway pattern, Module Federation-based frontend, and multi-repository code separation — enabling independent development, deployment, and scaling of each capability domain. A Big Data and ML/AI analytics stack sits beneath the operational layer, fed by ETL connectors that normalize streaming data from the system's message bus for machine learning, algorithm training, and AI agent development.

Prophesee supports dozens of concurrent users across multiple physical sites, spanning intelligence analysts, operational commanders, SA operators, technical operators, and system administrators — all managed through KeyCloak SSO with RBAC authorization enforced across every system flow via JWT. An integrated collaborative chat system enables real-time communication between users and an AI/LLM assistant, with the ability to share data items, map pointers, and files.

The platform scales from single-node tactical deployments to nationwide distributed intelligence centers, serving all echelons. A key early demonstration — the Attack Agent Demo — showcases an autonomous TCT (Time-Critical Target) attack workflow where AI agents orchestrate the full kill chain: sensor data ingestion, ATR (Automatic Target Recognition), multi-INT fusion, Rules of Engagement evaluation, planning aid generation, weaponeering, planning approval, tasking, and BDA (Battle Damage Assessment). Each stage is implemented as a standalone microservice, with partner systems (IronBrain for SAR ATR, MSG for weaponeering, Omnisys for tasking/BDA) integrated alongside Software Factory-developed agents for fusion, RoE, planning aids, and planning approval.

Phase 1 delivers the core situational awareness application — interactive geospatial display, multi-sensor detection management, rule-based alerting engine, and site management — establishing the operational foundation. The Attack Agent Demo builds on this foundation as the primary focus of early development phases, demonstrating the platform's AI agent architecture and multi-partner integration capability.

---

## Core Vision

### Problem Statement

Defense and national security organizations rely on legacy, monolithic C4ISR systems that are rigid, sensor-siloed, and increasingly unable to cope with the volume, velocity, and variety of modern ISR data. Intelligence analysts are overwhelmed by multi-sensor feeds, critical patterns are missed in massive data volumes, and the sensor-to-intelligence cycle remains measured in hours rather than minutes. Legacy systems are difficult to extend with new sensors, new algorithms, or new operational requirements, and cannot scale efficiently across deployment tiers. They lack modern collaborative tools, integrated AI assistance, and the big data foundations needed for machine learning and advanced analytics.

### Problem Impact

- Intelligence analysts spend the majority of their time on routine data correlation rather than high-value analysis
- Critical operational events are detected late or missed entirely due to data volume
- Adding new sensor types or capabilities to legacy systems requires extensive rework and long integration cycles
- Scaling from tactical to strategic deployments requires different systems rather than different configurations of the same platform
- The sensor-to-shooter cycle remains too long for modern operational tempo
- Collaboration between analysts, operators, and commanders across physical sites is fragmented and relies on external tools
- Legacy systems cannot leverage modern ML/AI for pattern recognition, anomaly detection, and automated classification
- Geospatial data management is inconsistent and not standards-compliant

### Why Existing Solutions Fall Short

Legacy C4ISR systems were designed as monolithic architectures tightly coupled to specific sensor types and fixed deployment configurations. They lack:

- **Modularity** — capabilities cannot be independently developed, deployed, or scaled
- **Sensor agnosticism** — each new sensor requires deep integration into the core system
- **Modern web UX** — operators work with dated interfaces that hinder rapid decision-making
- **Standards interoperability** — compliance with STANAG, ASTERIX, NMEA, AIS, and OGC standards is incomplete or bolted-on
- **Scalable architecture** — the same codebase cannot serve tactical stations and national centers
- **Big Data / AI foundation** — no integrated pipeline for ML training, algorithm development, or AI-assisted analysis
- **Collaborative intelligence** — no built-in communication, data sharing, or AI-assisted collaboration between users and roles
- **Geospatial standards compliance** — geospatial data management is proprietary rather than OGC-based

### Proposed Solution

Prophesee is an open-architecture, cloud-native intelligence platform built on:

- **WebKit-based Module Federation frontend** — each capability domain (SAR, SIGINT, SA, etc.) is developed as an independent federated module in its own code repository, composed at runtime into a unified Cesium-based 3D geospatial application
- **Sensor Gateway pattern** — each physical sensor type (Capella SAR, ELINT receivers, etc.) connects through a dedicated gateway that translates sensor-specific data into canonical system data models. The core platform operates on these canonical models, making it inherently sensor-agnostic
- **Microservices backend** — stateless services (C#/Node), database-per-service, RabbitMQ for data distribution, gRPC for service-to-service, REST/WebSocket for client-to-backend
- **Big Data & AI/ML Analytics Stack** — ETL connectors collect and normalize data from the RabbitMQ message bus into a big data platform where machine learning model training, algorithm development, and AI agent creation take place. Algorithmic capabilities deploy as standalone microservices that plug into the operational platform
- **AI Agent-Based Targeting Workflow** — autonomous AI agents orchestrate complex operational processes (fusion, RoE evaluation, planning aids, planning approval) as standalone microservices. Each agent operates within a human-in-the-loop (HITL) framework, presenting recommendations and requiring operator approval at decision gates. The chat system serves as the human-agent interaction channel for conversational AI tasks (e.g., semantic fusion queries)
- **Multi-Partner Integration Architecture** — the platform integrates with partner systems (IronBrain for SAR ATR, MSG for weaponeering, Omnisys for tasking/BDA) through defined interfaces, enabling a composite demonstration where each partner's autonomous agent handles its domain-specific stage of the operational process
- **Multi-role, multi-site user management** — KeyCloak SSO with RBAC authorization, JWT-based identity flowing through every system operation. Supports intelligence analysts, commanders, SA operators, operational commanders, technical operators, and system administrators across dozens of users at multiple physical sites
- **Collaborative chat system** — integrated one-to-one and one-to-many messaging with the ability to share data items, map pointers, and file attachments. Includes an AI/LLM bot participant for intelligent assistance within the operational workflow
- **OGC-compliant geospatial data management** — GeoServer (open source) as the default implementation for serving maps, orthophotos, vector data, meshes, and 3D content via WMS, WFS, WCS, and other OGC standards
- **Multi-repo code architecture** — core platform, each sensor domain (SAR, SIGINT, etc.), each gateway, and each algorithmic service live in separate repositories for independent development and deployment lifecycles
- **Helm-based Kubernetes deployment** — scalable from single-node tactical to multi-site nationwide, with Consul for service discovery, Vault for secrets management, and OpenTelemetry for observability
- **Standards-first design** — native support for STANAG 4676, ASTERIX, NMEA, AIS, and OGC standards

### Key Differentiators

1. **Architectural Flexibility** — Module Federation + multi-repo + gateway pattern enables truly independent capability development and deployment
2. **Sensor Versatility** — any sensor can be integrated by implementing a gateway to the canonical data model, without modifying the core
3. **Scalable Deployment** — identical platform from tactical field stations to national intelligence centers, differentiated by configuration, services deployed, and modules activated
4. **Standards-First Interoperability** — native support for STANAG 4676, ASTERIX, NMEA, AIS, and OGC standards throughout
5. **Big Data & AI Foundation** — integrated ETL pipeline into a big data stack for ML training, algorithm development, and AI agent creation, with trained models deploying as plug-in microservices
6. **Collaborative Intelligence** — built-in chat with data sharing, map pointers, file attachments, and an AI/LLM assistant embedded in the operational workflow
7. **OGC Geospatial Standards** — GeoServer-based geospatial data management with full OGC compliance (WMS, WFS, WCS)
8. **Progressive Capability Delivery** — operational value from Phase 1 (SA application), with AI/ML, advanced exploitation, and additional sensors layered incrementally
9. **Legacy Modernization Path** — designed to replace legacy systems while maintaining interoperability during transition
10. **AI Agent Kill Chain** — autonomous AI agents orchestrate complex multi-stage operational processes (sensor-to-shooter), each as a standalone microservice with HITL approval gates, enabling the full TCT attack workflow from detection through BDA
11. **Multi-Partner Composability** — partner systems (IronBrain, MSG, Omnisys) integrate through defined interfaces, each contributing domain-specific autonomous agents to a composite operational workflow

---

## Target Users

### User Role Model

Prophesee implements a dynamic role-based access model through KeyCloak SSO. Roles are not hardcoded — new roles can be created and capabilities attached to them via KeyCloak administration. All system flows enforce the permissions of the initiating user via JWT tokens. The following are the baseline roles:

### Primary Users

**1. Intelligence Analyst**
- **Role:** Analyze multi-sensor data, define rules and rule presets, investigate detections, generate intelligence reports
- **Day-to-day:** Reviews the situational picture, investigates alerts generated by the rule engine, correlates detections across sensor disciplines, classifies and affiliates detections, creates and manages sites of interest, produces intelligence products for commanders
- **Pain with legacy:** Drowning in unfiltered multi-sensor data, manually correlating across siloed systems, spending most time on routine matching rather than high-value analysis
- **Success with Prophesee:** AI-assisted correlation surfaces the important events, rule engine automates routine monitoring, unified display across all sensor types, collaborative tools enable rapid sharing of findings

**2. SA Operator**
- **Role:** Monitor the real-time situational awareness picture, react to alerts, maintain operational awareness
- **Day-to-day:** Watches the live geospatial display, responds to rule engine alerts as they pop up, tracks entity movements, escalates significant events to analysts or commanders
- **Pain with legacy:** Alert fatigue from poorly filtered notifications, fragmented displays requiring multiple screens/systems, no ability to quickly share what they're seeing with the team
- **Success with Prophesee:** Intelligent alerting with priority-based filtering, unified map display with all sensor data overlaid, one-click escalation and chat-based collaboration

**3. Commander**
- **Role:** Make operational decisions based on intelligence products, assign missions for further sensor operations, direct operational response
- **Day-to-day:** Reviews intelligence reports and alerts, assesses the operational picture, decides on courses of action, tasks sensor operations, coordinates between groups
- **Pain with legacy:** Delayed intelligence products, incomplete picture across sensor types, difficulty coordinating across distributed teams
- **Success with Prophesee:** Real-time operational picture, rapid intelligence cycle, chat-based coordination with analysts and operators, clear alert prioritization

### Secondary Users

**4. Technical Operator**
- **Role:** Monitor system health, load, IT status, logs, metrics, and telemetry to determine if the system is functioning normally
- **Day-to-day:** Watches system dashboards (OpenTelemetry/Grafana), reviews logs, identifies performance issues, reports malfunctions, monitors service health across the Kubernetes cluster
- **Pain with legacy:** Opaque system internals, no unified monitoring, difficulty diagnosing issues across distributed components
- **Success with Prophesee:** OpenTelemetry-based observability, distributed tracing, centralized logging, real-time health dashboards

**5. System Administrator**
- **Role:** Deploy updates and new modules, manage geospatial infrastructure (GeoServer), configure the system, manage users and roles in KeyCloak
- **Day-to-day:** Deploys Helm charts for new services/modules, loads map layers and geospatial data into GeoServer, creates/modifies roles and groups in KeyCloak, manages system configuration
- **Pain with legacy:** Monolithic deployments requiring full system updates, no independent module deployment, manual configuration management
- **Success with Prophesee:** Independent module deployment via Helm, GeoServer-based geospatial data management, centralized identity management via KeyCloak

### Organizational Model & Data Scoping

Users are organized into **groups** defined by region, responsibility, or other organizational criteria:

- **Group membership determines data visibility** — a user assigned to "Northern Region" sees detections, alerts, and sites scoped to that region
- **Multi-group membership** — a user can belong to multiple groups and sees the union of all their groups' data
- **No group = unrestricted** — a user not assigned to any group has no data scope restrictions (sees all data)
- **Each group can have a commander** — the commander role within a group provides oversight and decision authority for that group's operational area
- **Roles are orthogonal to groups** — KeyCloak roles define *what a user can do* (capabilities/permissions), groups define *what a user can see* (data scope). These are independent dimensions

### User Journey

**Onboarding:**
1. System Administrator creates the user in KeyCloak, assigns role(s) and group(s)
2. User authenticates via SSO, receives JWT with embedded role and group claims
3. The system renders the appropriate UI modules and data scope based on the user's role and group membership
4. User sees a personalized workspace — analysts see analysis tools and detection panels, operators see the SA display with alert notifications, commanders see operational dashboards and reports

**Core Usage Loop:**
1. Sensor gateways ingest data → canonical data models → RabbitMQ → services process and store
2. Rule engine evaluates detections against active rules on sites → generates alerts
3. SA Operators and Analysts see alerts, investigate detections, classify entities, manage sites
4. Analysts produce intelligence products, share findings via chat (including map pointers and data items)
5. Commanders review products, make decisions, assign follow-up sensor missions
6. Technical Operators monitor system health throughout; System Admins deploy updates and manage infrastructure

---

## Success Metrics

### Phase 1 Success Criteria

Phase 1 is successful when the following capabilities are operational:

1. **Core SA Application** — fully functional situational awareness display on Cesium/React with map management, detection display, site management, rule engine, and alert management (as specified in the Castodio requirements)
2. **SAR Sensor Integration** — Capella SAR gateway operational, with SAR image catalog, search, display on map, and basic exploitation tools (measurement, histogram adjustment, brightness/contrast, flicker comparison)
3. **Multi-user Operation** — KeyCloak SSO with RBAC, multiple concurrent users across roles and groups, JWT-enforced permissions
4. **Rule Engine & Alerting** — operational rule presets, site-based rule assignment, automated alert generation and management
5. **Chat System** — basic collaborative messaging between users with data item and map pointer sharing
6. **Infrastructure** — Helm-deployed on Kubernetes, GeoServer serving geospatial data via OGC standards, OpenTelemetry observability operational

### Operational Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Alert delivery latency | Immediate (real-time) | End-to-end from gateway ingestion to operator notification via WebSocket push |
| Data display latency | Minimal latency from ingestion to web UI | End-to-end from data arriving at gateway to rendering on operator's screen |
| Map rendering performance | 60 FPS sustained during navigation | Client-side performance monitoring |
| Concurrent users supported | Scales with deployment tier (tactical: 5-10, theater: 50-100, strategic: 1000+) | Load testing per deployment configuration |
| System availability | 99.9% uptime | Monitoring and incident tracking |
| New sensor gateway integration time | Measurably faster than legacy system | Time from gateway development start to operational data flow |
| New module deployment time | Independent deployment without system downtime | Helm release cycle time |

### Non-Functional Success Metrics

**Security:**
- KeyCloak SSO with RBAC enforced across all system flows
- JWT-based authorization validated at every service boundary
- Data classification and group-based access scoping operational
- Encryption at rest and in transit for all data
- OWASP Top 10 compliance validated

**Stability & Resilience:**
- Stateless services with automatic recovery from single-node failures
- Graceful degradation when individual sensor gateways or services are unavailable
- No data loss during service restarts or failovers
- Automated health checks and self-healing via Kubernetes

**Usability:**
- Operators can perform core SA tasks (view detections, respond to alerts, manage sites) with minimal training
- Intuitive Cesium-based map interaction (pan, zoom, rotate, tilt)
- Consistent UX patterns across all federated modules
- Responsive interface across desktop and large-format displays

### Business Objectives

| Objective | Target | Timeframe |
|-----------|--------|-----------|
| Phase 1 delivery to first customer | Operational SA application with Capella SAR integration | First major milestone |
| Multi-customer readiness | Platform demonstrated with at least one additional sensor type beyond SAR | Post Phase 1 |
| Platform extensibility proven | New sensor gateway integrated by a separate development team without core platform changes | Ongoing validation |
| Legacy system replacement | Customer transitions from legacy to Prophesee for operational use | Per customer engagement |

### Key Performance Indicators

1. **Sensor-to-operator cycle time** — time from sensor data arrival at gateway to operator seeing the detection on screen
2. **Alert-to-action cycle time** — time from alert generation to commander decision
3. **System uptime** — measured availability across all deployment tiers
4. **Module independence** — percentage of deployments/updates that require zero changes to other modules
5. **Gateway reuse** — number of different customers/deployments using the same gateway implementation
6. **User satisfaction** — qualitative feedback from operational users during acceptance testing

---

## MVP Scope

### Core Features (Phase 1)

**1. Core Platform Infrastructure**
- WebKit-based Module Federation shell application with Cesium 3D geospatial display
- KeyCloak SSO integration with RBAC, JWT-based authorization, group-based data scoping
- RabbitMQ message bus for internal data distribution
- GeoServer for OGC-compliant geospatial data serving (WMS, WFS, WCS)
- Helm-based Kubernetes deployment with basic health checks
- OpenTelemetry instrumentation for observability (logs, metrics, traces)
- Consul for service discovery, Vault for secrets management
- Externalized configuration via environment variables

**2. Situational Awareness Application (Core SA Module)**
- Main map display with Cesium 3D globe, map/layer management, toolbars
- Detection display — view, classify, affiliate detections on map with discipline-specific icons (SAR, ELINT, FS)
- Detection table — tabular view of all detections with sort/filter/export
- Detection history and movement trails
- Color-coded affiliation display (Unknown/Hostile/Friendly/Neutral)
- Information filter — filter displayed detections by sensor discipline, sites, targets

**3. Sites Management**
- Create, edit, delete sites as polygons on the map
- Site parameters (name, affiliation, type, priority, coordinates)
- Link rule presets to sites
- Sites list with sort/filter/export
- Visual site display — color by affiliation, solid/dashed line for active/inactive rules

**4. Rule Engine & Alerting**
- Rule preset creation and management (rule types, thresholds, parameters)
- Site-based rule assignment and activation
- Automated alert generation when rule criteria are met
- Alert management — view, close, escalate alerts
- Alert list with sort/filter/export
- Alert visualization on map (red aura on detections, pop-up notifications)
- Alert priority levels

**5. SAR Sensor Integration (Capella Gateway)**
- Capella SAR gateway — ingest SAR data, translate to canonical SAR data model
- SAR image catalog and search (filter by time, location, metadata)
- SAR image display on map (overlay with geo-referencing)
- Basic SAR exploitation tools: measurement (distance, area), histogram adjustment, brightness/contrast, flicker comparison between images

**6. Collaborative Chat**
- One-to-one and one-to-many messaging
- Share data items (detections, alerts, sites) in chat
- Share map pointers (coordinates/locations)
- File attachments

**7. Basic Utilities**
- Measurement tools (distance, area — configurable units)
- Annotations on map (square, circle, line, polygon with color)
- Jump-to-coordinates
- Coordinate system selection
- Timeline investigation mode (offline replay with time controls)

**8. Admin Functions**
- System configuration display (sensor connectivity status)
- GCS/Platform selection for mission
- Server storage management
- Classification category management
- System status (external monitoring link)

**9. Attack Agent Demo (Early Development Focus)**

The Attack Agent Demo is a focused demonstration of an autonomous TCT attack workflow, built on the core SA platform. Software Factory-developed components:

- **SIGINT Data Ingestion** — SIGINT intercept display on the Prophesee viewer (entities, layers, areas, tables)
- **Fusion Agent** — AI agent performing semantic fusion of SIGINT and VISINT data via chat interface (LLM-based conversational queries with entity-linked responses displayed on map)
- **RoE Agent** — AI agent evaluating Rules of Engagement against predefined rule sets, generating approval/cancellation recommendations with causality explanations (HITL)
- **Planning Aids Agent** — automated creation of planning aid entities (target image, coordinates, target family, description) with user approval and "send to planning" workflow
- **Planning Approval Agent** — AI agent evaluating weaponeering results against predefined parameters (ALR, CDE, approving authority), presenting traffic-light risk assessment for each target, with approve/send-to-strike gates

Partner-provided components (integrated via defined interfaces):
- **SAR ATR** — IronBrain (Few Shots SAR, Automatic Target Recognition)
- **Weaponeering** — MSG (strike planning: weapon type, quantities, fuse delays, collateral damage assessment)
- **Tasking & BDA Planning** — Omnisys (platform-to-target assignment, execution planning, BDA collection planning)

Demo data injection capability (JSON-based, real-time, similar to Goldstar pattern) is required for scripted demonstration scenarios.

### Out of Scope for MVP

The following are explicitly deferred to future phases:

- **Production AI/ML algorithms** — production-grade automated classification, anomaly detection, pattern recognition (demo agents use scripted/constrained AI)
- **Big Data analytics stack** — full ETL connectors, ML training pipeline (beyond what's needed for demo agents)
- **Additional sensor gateways** — EO/IR, FMV, LiDAR, OSINT (SIGINT and SAR are covered by the demo)
- **Advanced imagery exploitation** — photogrammetry, DEM generation, orthorectification, spectral analysis, InSAR, polarimetric SAR
- **Full Motion Video (FMV)** — video streaming, object tracking in video, video analysis
- **Intelligence report generation** — automated report creation, GeoPDF, PowerPoint, military format products
- **Sensor management & cueing** — automated sensor tasking and scheduling (beyond demo-level Omnisys integration)
- **Cross-domain solutions** — multi-classification level support, CDS
- **Coalition operations** — multi-national data sharing, release authority controls
- **3D modeling** — photorealistic 3D model creation, building extraction, LiDAR exploitation
- **Advanced performance optimization** — WebAssembly for compute-intensive operations, web workers
- **Offline/disconnected operations** — sync-on-reconnect, air-gapped deployment support

### MVP Success Criteria

Phase 1 is validated when:

1. **Operational readiness** — the SA application can be demonstrated to a customer with live or simulated Capella SAR data flowing through the gateway, detections displayed on the map, rules triggering alerts, and multiple users operating simultaneously
2. **Architecture validation** — a second sensor gateway (e.g., ELINT) can be developed by a separate team in a separate repository and integrated without modifying the core platform
3. **Security baseline** — KeyCloak SSO operational, RBAC enforced, JWT validated at service boundaries, group-based data scoping working
4. **Deployment proven** — Helm-based deployment to Kubernetes is repeatable and documented
5. **Customer acceptance** — first customer accepts Phase 1 delivery for operational evaluation
6. **Attack Agent Demo** — the autonomous TCT attack workflow is demonstrated end-to-end: SIGINT + SAR data ingested, fusion agent correlates multi-INT data via chat, RoE agent evaluates targets, planning aids generated and approved, weaponeering results reviewed, planning approval with traffic-light risk assessment, and tasking/BDA handoff to partner systems — all within the Prophesee viewer with scripted demo data

### Future Vision

**Phase 2 — Expanded Sensor Integration & Intelligence Production:**
- Additional sensor gateways (EO/IR, FMV)
- Production-grade SIGINT gateway (beyond demo-level)
- Intelligence report generation (automated templates, GeoPDF, military formats)
- Advanced SAR tools (CCD, InSAR)
- Sensor management and cueing
- Production hardening of Attack Agent Demo agents (fusion, RoE, planning aids, planning approval)

**Phase 3 — AI/ML & Advanced Analytics:**
- Big Data stack with full ETL connectors from RabbitMQ
- ML model training and deployment pipeline
- Production-grade ATR and automated classification
- AI/LLM chat bot for general operational assistance (beyond fusion-specific agent)
- Pattern recognition and behavioral baselines
- Additional AI agents for new operational workflows

**Phase 4 — Full Capability Suite:**
- Photogrammetry, DEM generation, 3D modeling
- Full Motion Video exploitation
- Advanced spectral analysis
- LiDAR exploitation

**Phase 5 — Enterprise Scale:**
- Multi-classification level support and cross-domain solutions
- Coalition operations and multi-national data sharing
- Disconnected/air-gapped operations
- Strategic-scale deployments (1000+ users, petabyte archives)
