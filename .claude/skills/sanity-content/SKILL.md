---
name: sanity-content
description: Create or update content in Sanity CMS — cryptids, anomalies, bulletins. Guides through required fields and uses the Sanity MCP tools to publish.
disable-model-invocation: true
---

# Sanity Content Creator

Create content documents in Sanity CMS for the Appalachian Cryptid Compendium.

## Usage

`/sanity-content <type> [name]`

- `/sanity-content cryptid Mothman` — create a new cryptid entry
- `/sanity-content anomaly` — create a new anomaly (will prompt for details)
- `/sanity-content bulletin` — create a new bureau bulletin

## Workflow

### Step 1: Load the schema

Before creating any content, fetch the current schema to ensure field accuracy:

```
Use mcp__Sanity__get_schema to load the schema for the target document type.
```

### Step 2: Gather required fields

Based on the document type, collect information from the user. Ask for anything not provided in the initial command.

**Cryptid** (`cryptid` type):
- `name` (string, required) — common name
- `slug` (slug, auto-generated from name)
- `classification` — e.g., "Humanoid", "Winged", "Aquatic"
- `dangerLevel` — "Low", "Moderate", "High", "Extreme"
- `region` — specific Appalachian location
- `states` — array of US states
- `firstSighting` — year of first documented sighting
- `description` — portable text, main body
- `physicalDescription` — portable text
- `behavior` — portable text
- `notableEncounters` — portable text
- `status` — "Active", "Dormant", "Unconfirmed"

**Anomaly** (`anomaly` type):
- `name`, `slug`, `description`, `region`, `states`
- `anomalyType` — e.g., "Light phenomenon", "Sound", "Geological"
- `firstReported` — year

**Bulletin** (`bulletin` type):
- `title`, `slug`, `body` (portable text)
- `publishedAt` — date
- `category` — e.g., "Field Report", "Advisory", "Research Update"

### Step 3: Create the document

Use `mcp__Sanity__create_documents_from_json` to create the document in Sanity.

- Set `_type` to the correct document type
- Generate the slug from the name/title using kebab-case
- For portable text fields, use the block array format:
  ```json
  [{"_type": "block", "children": [{"_type": "span", "text": "Content here"}]}]
  ```

### Step 4: Confirm and provide links

After creation:
1. Confirm the document was created successfully
2. Provide the Sanity Studio URL: `https://appalachian-cryptid.sanity.studio/structure/<type>;{id}`
3. Remind the user to add an image in the Studio if needed
4. Note that the webhook will auto-revalidate the site when the document is published

## Important Notes

- The Sanity project ID is `8thljucm`, dataset is `production`
- Always use `mcp__Sanity__get_schema` first — schema fields may have changed
- Images must be uploaded through Sanity Studio (MCP can't upload images)
- Documents are created as drafts — remind the user to publish in Studio
