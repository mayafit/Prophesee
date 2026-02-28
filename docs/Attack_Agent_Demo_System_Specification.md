Date: January 25, 2025

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Subject: System Specification for Attack Agent Demonstration in
Germany**

# Background:

2\. Purpose of the demonstration:

1.  a\. Presenting the capability of a complete autonomous process for
    attacking a TCT target

3\. Part of the process components will be presented as a complete
demonstrator based on existing demonstrators or in partnership with
other suppliers (IRONBRAIN, OMNISYS, MSG).

4\. We want to develop a focused UI mockup for process components that
don\'t have an existing demonstrator.

5\. Creating an impressive UI will greatly contribute to the
demonstration\'s success.

# Operational Scenario:

6\. Period of tension on the country\'s border. Operational need to
monitor threatening areas, enemy fixed sites, and mobile weapon system
components.

7\. Given the arrival of relevant weapon system components to
threatening areas, a quick strike is required to destroy the enemy.

8\. In the early morning hours (of the event day), intelligence arrives
about tanks/launchers leaving an enemy fixed site and positioning in
attack areas.

9\. Operational tasks:

-   a\. Locating the fixed site from which the components departed.

-   b\. Understanding the components that \"departed\" from the site.

-   c\. Locating the components.

-   d\. Verifying that the components are active and creating a threat.

-   e\. Attacking the components.

-   f\. Conducting BDA.

10\. SAR image comparison is performed using FS on a suspected fixed
site. Component \"departure\" is detected.

11\. Spatial decoding is performed using FS and the components that left
the fixed base are located when they are deployed in a threatening area.

12\. Cross-referencing and fusion are performed against SIGINT
intercepts from the area. It is evident that the targets are
\"transmitting\" and therefore creating a threat.

13\. The targets are transferred to strike planning, strike, and BDA.

# Process Stages:

(Flowchart images would be inserted here)

# Stage Division by Work Partners:

14\. Classifier training \-- stage not presented. Conceptual only

15\. Raw Data stage:

-   a\. Few Shots SAR \-- IRONBRAIN

-   b\. SIGINT - Software Factory

16\. ATC:

-   a\. SAR \-- IRONBRAIN

-   b\. SIGINT \-- Software Factory

17\. Fusion \-- Software Factory (semantic fusion only)

18\. RoE \-- Software Factory

19\. Planning Aids - Software Factory

20\. Weaponeering \-- MSG

21\. Planning Approval \-- Software Factory

22\. Tasking - Omnisys

23\. BDA Planning - Omnisys

# Stage Details and Required Development:

## 24. Raw Data Stage

a\. Stage essence: Examining SIGINT icons on a map in Starlight viewer.

b\. Details:

i\. General screen design - Starlight viewer (WISP).

ii\. Screen center - Rasters - map, imagery.

iii\. Capability to display layers and entities on top of the raster is
required.

iv\. Tables and menus:

• Entities

• Alerts

• Areas

v\. Functionality:

• Ability to switch raster

• Ability to turn layer on/off

• Ability to create entity - ID, classification, creation time, entering
aid for entity, defining location for entity

• Ability to \"investigate\" entity - opening entity details, displaying
entity on map, examining parameters (Significant parameters - ID,
classification, intercept time, aid if available)

• Ability to investigate alert - in the same manner

vi\. Required layers:

• Old SIGINT intercepts

• Threatening areas

• Fixed sites

• FS decoding findings

vii\. Demonstration:

• Ability to inject demo data (JSON file) in real-time similar to
Goldstar

## 25. ATR Stage

Not required in mockup. It is demonstrated using IB\'s system.

## 26. Fusion Stage

a\. Stage essence:

i\. Demonstrating use of AI agent

ii\. Requesting the agent to perform (semantic) fusion of SIGINT and
VISINT information and create a target based on this

b\. General screen design, screen center, layer and entity display
capabilities, tables and menus - as in previous stage.

c\. Additional functionality:

i\. Opening chat window with the agent

ii\. Free language conversation - asking questions and receiving answers

iii\. Question/prompt window:

• Regular text input in English

iv\. Answer window:

• Textual answer

• Display of entities linked to the answer (list or table)

• Clicking on linked entity:

\- Display the entity on top of the raster while showing all data
related to it in a Tooltip floating near the entity

\- Opening entity details window (entity details: ID, classification,
intercept time, aid if available)

v\. Demonstration:

• The questions and answers will be scripted in advance, including the
stage of displaying entities on the map

• Example questions (final phrasing will be later):

\- Were there SIGINT intercepts from entity area X+Y+Z in recent hours

\- Were there SIGINT intercepts from polygon X in recent hours

• Example answers (final phrasing - later):

\- There are several matching intercepts. Display list of intercepts.
And display all intercepts on map

## 27. RoE Stage

a\. Stage essence:

i\. Demonstrating AI agent decision-making regarding
approval/cancellation for striking a target

ii\. The agent will operate according to a defined set of rules and
formulate a recommendation to the user (HITL)

iii\. The agent will alert about target approval/cancellation for strike
in the alerts window and display causality

b\. Details:

i\. General screen design - as in previous stage

ii\. Alerts window - as in previous screen

iii\. Agent alert - text window with alert display and causality
explaining the agent\'s recommendation

iv\. Functionality:

• Ability to enter alert entity in alerts window

• When clicking on the alert - \"highlighting\" entities related to the
target

v\. Demonstration:

• Will be scripted in advance

• Alert popup on new approved targets

• Text: Target details, reason details for approval referring to all
current intelligence and the area where targets are deployed

## 28. Planning aids Stage

a\. Stage essence:

i\. The agent will automatically create planning aids

ii\. The aids will be transferred to the strike planning agent

b\. Details:

i\. General screen design \-- use previous screen

ii\. Functionality:

• Right-click on target → Create planning aid

• The system will create a planning aid entity containing target image
(prepared in advance) and parameters for strike planning:

\- Target name (in format to be defined later)

\- Target type \-- for investigation/for strike planning

\- Target family (TACA, TACC, tank, launcher\...)

\- Target description

\- Coordinates

\- Height

• The entity can be displayed

• Additional \"buttons\" in entity:

\- Approve (For user approval of created aid)

\- Send to planning

• The agent will send the planning files to MSG\'s system (interface
between systems will be specified later)

iii\. Demonstration:

• The user will send each target created in the fusion stage for aid
creation

• After creating aid, will review them, click approve and \"send to
planning\"

## 29. Weaponeering Stage: Responsibility of partner company in Germany

a\. Stage essence:

i\. Strike planning agent that receives target entity data and planning
data and performs strike planning

ii\. Planning result - weapon type, weapon quantities, fuse delays,
whether there are friendly forces nearby, collateral damage,
environmental damage

iii\. Demonstration:

• The company\'s planning system will receive the planning aids and
perform planning

• At end of planning process the system will export \"aids\" for process
continuation containing:

\- All information that arrived in planning aid

\- All information of actual planning (parameters above)

• Interface for transferring information to continuation agent - will be
closed later

## 30. Planning approval Stage

a\. Stage essence:

i\. The agent will receive planning data, examine it in light of
predefined parameters, and decide whether the target is approved for
strike

ii\. The agent will add execution instructions adapted to predefined
parameters

b\. Details:

i\. General screen design \-- WISP screen, as in previous stages

ii\. Alert popup in alerts window

iii\. Alerts window - as in previous screen

iv\. Agent alert:

• Text window with alert display and causality explaining the agent\'s
recommendation

• Parameter table for analyzing each target:

\- Target name

\- Family (TACA, TACC etc.)

\- ALR \-- possible risk level in strike (affects decision whether to
strike using manned tool or not)

\- CDE \-- collateral damage

\- Approving authority (which rank needs to approve the target)

• Each parameter will have predefined options

• Ability to color displayed parameter in \"traffic light\" to reflect
degree of suitability for strike approval (red - not suitable, green -
suitable)

v\. Functionality:

• Ability to enter alert entity in alerts window

• When clicking on alert - \"highlighting\" entities related to target

• In alert window - \"approve\" button and \"send to strike\" button

vi\. Demonstration:

• Will be scripted in advance

• Alert popup on targets approved for strike

• Opening the alert

• Review of text written in it:

\- Targets X+Y+Z approved for immediate strike (in German partner\'s
language \-- SMACK)

\- Display target table and display parameters above

\- Display strike instructions for each target - textually

• Clicking \"approve\" and \"send to strike\" buttons

## 31. Tasking Stage: (Omnisys system)

a\. Stage essence:

i\. The agent will receive targets approved for strike, and assign them
to relevant strike platform from the OOB allocated to it in the system

ii\. Then the agent will perform execution planning for platform \--
flight path, addressing threats, altitude, times, release point etc.

iii\. The agent will present the planning to the user for approval

b\. Details:

i\. General screen design \-- Omnisys system screen

ii\. Tables and menus:

• \"Available OOB\" table with columns:

\- Call sign

\- Platform type - fighter jet, UAV, remotely guided weapon, drone,
mission aircraft

\- Next to type - icon matching type (fighter jet, UAV etc.)

\- Work time (available hours of the tool)

\- Weapons and quantity on platform

\- Observation payload on platform (specify payload type)

\- Targets for strike assigned to platform

\- Icon showing mission type the platform is required to do \--
strike/imaging

\- Time to execution \-- date, time

• Threats tables - details of relevant threats. According to existing
format in system

• Planning tables:

\- Routes

\- Targets

\- Turn-exit points and similar

\- Release points

\- Any other entity in planning

iii\. Alert popup in alerts window

iv\. Alerts window - as in previous screen

v\. Agent alert:

• Text window showing targets assigned to platforms

• Target name details, clickable and linkable (hyperlink)

vi\. Functionality:

• Ability to enter alert entity in alerts window

• When clicking on alert - \"highlighting\" entities related to target

• When clicking on target name \-- opening available OOB table and
highlighting relevant platform row

• \"Approve mission\" button next to each platform that has a change
(for example - received new target)

vii\. Demonstration:

• Will be scripted in advance

• Alert popup on target assignment to platform

• Opening alert

• Review of text

• Opening OOB table

• Clicking \"approve mission\"

## 32. BDA planning Stage: (Omnisys system)

a\. Stage essence:

i\. The agent will perform visual collection planning for BDA according
to various parameters defined in advance

ii\. Every target assigned to platform and which user approved the
assignment - sent automatically to BDA planning

iii\. Planning will be performed according to collection OOB allocated
to mission, as well as according to required times and threats in area

b\. Details:

i\. General screen design \-- Omnisys system

ii\. Alert popup in alerts window

iii\. Alerts window - as in previous screen

iv\. Agent alert:

• Text window showing BDA planning performed

• Target name details, clickable and linkable (hyperlink)

• BDA planning details - textual

v\. Functionality:

• Ability to enter alert entity in alerts window

• When clicking on alert - \"highlighting\" entities related to target

• When clicking on target name \-- opening available OOB table and
highlighting relevant platform row

• \"Approve mission\" button next to each platform that has a change
(for example - received new target for imaging)

vi\. Demonstration:

• Will be scripted in advance

• Alert popup on target assignment for imaging to platform

• Opening alert

• Review of text

• Opening OOB table

• Clicking \"approve mission\"

Regards,

Elkanah Malka

Marketing and Business Development

Intelligence Director
