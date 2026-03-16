<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

import { ref, computed } from 'vue';

const loading = ref(false);


</script>

<template>
  <BContainer>
    <BRow>
      <BCol v-if="loading">
        <BSpinner label="loading" class="mx-1" />
      </BCol>
      <BCol v-else>
        <h1>Welcome!</h1>
        <br>
        <h4>This app is your tool for reviewing files that are waiting to be ingested into the Library of Everything.</h4>
        <p>
          <strong>Select an option from the menu to get started.</strong>
        </p>
      </BCol>
    </BRow>
    <BRow v-if="!loading">
      <BCol>
        <h2>Usage Guide</h2>
        <br>
        <h3>Movies</h3>
        <p>
          The API scans direcory names in <code>/holding_bay/movies/</code>, performs a search against <a href="">IMDB API</a> and returns a list of results.
          Scanned directories with no results are ignored. Verify results and update properties as needed.
        </p>
        <table class="table">
          <thead>
            <tr><td colSpan="2"><h4>Controls</h4></td></tr>
            <tr>
              <th>Control</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cover Image</td>
              <td>Activates <code>CoverModal</code>. Paste in a URL to update.</td>
            </tr>
            <tr>
              <td><BButton variant="info">></BButton></td>
              <td>
                Open a new window and play the movie in your browser.
                <br>
                Use This to make sure it is what you think it is.
              </td>
            </tr>
            <tr>
              <td><BButton variant="success">+</BButton></td>
              <td>Process the item into the LOE.</td>
            </tr>
            <tr>
              <td><BButton variant="danger">x</BButton></td>
              <td>Delete the item from the server.</td>
            </tr>
          </tbody>
        </table>
      </BCol>
    </BRow>
    <BRow v-if="!loading">
      <BCol>
        <h3>Music</h3>
        <p>
          The API scans <code>/holding_bay/music/</code> for <code>.mp3</code> files, parses their <code>id3v2</code> tags,
          and returns a list grouped by artist and album along with a list of potential cover files.
          Scanned files with empty or unreadable tags are ignored. Verify results and update properties as needed.
        </p>
        <table class="table">
          <thead>
            <tr><td colSpan="2"><h4>Controls</h4></td></tr>
            <tr>
              <th>Control</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><BButton variant="warning">#</BButton></td>
              <td>Trim leading <code>0's</code>s from track numbers.</td>
            </tr>
            <tr>
              <td><BButton variant="warning">C</BButton></td>
              <td>
                Active the <code>CoverModal</code> to asssociate a cover image with each song in the selected organizational unit.
              </td>
            </tr>
            <tr>
              <td><BButton variant="warning">P</BButton></td>
              <td>Parse featured artists from Song Titles.*</td>
            </tr>
            <tr>
              <td><BButton variant="success">+</BButton></td>
              <td>Process the items in the selected organizational unit into the LOE.</td>
            </tr>
            <tr>
              <td><BButton variant="info">~</BButton></td>
              <td>Batch update properties on the selected organizational unit.</td>
            </tr>
            <tr>
              <td><BButton variant="danger">x</BButton></td>
              <td>Delete all items in the selected organizational unit from the server.</td>
            </tr>
            <tr>
              <td><BButton variant="info">MA</BButton></td>
              <td>Open a new tab, searching the selected organizational unit on <a href="https://www.metal-archives.com/" target="_blank">Metal-Archives.com</a></td>
            </tr>
            <tr>
              <td><BButton variant="info">WIKI</BButton></td>
              <td>Open a new tab, searching the selected organizational unit on <a href="https://www.wikipedia.org/" target="_blank">Wikipedia.com</a></td>
            </tr>
          </tbody>
        </table>
        <BListGroup>
          <BListGroupItem>Notes</BListGroupItem>
          <BListGroupItem>
            Each time the server processes a song, it checks for a <code>cover.jpg</code> file in the source direcory. If it is present, it is moved to the destination directory.
            The <code>CoverModal</code> can be used to manually select a choice from a list of discovered <code>.jpg</code> files during the scan.
          </BListGroupItem>
          <BListGroupItem>
            Songs who's artist property does not match that of their container will be colored <span style="background-color:#ff6a00">orange</span>
          </BListGroupItem>
          <BListGroupItem>
            *Featured artist parsing applies the following:
            <ul>
              <li>
                Matches everything between <code>[]</code> and removes it.
              </li>
              <li>
                Matches everything between <code>()</code>
              </li>
              <li>
                Replaces them with <code>[]</code>
              </li>
              <li>
                Inserts the value into the song's <code>feat</code> property.
              </li>
            </ul>
          </BListGroupItem>
        </BListGroup>
      </BCol>
    </BRow>
    <BRow>
      <BCol>
        <h3>Tv</h3>
        <p>
          The API scans <code>/holding_bay/tv/</code> for <code>mp4</code>, <code>avi</code>, and <code>mkv</code> files, and returns them grouped by their folder structure.
          <br><strong>Intended server-side structure</strong>
        </p>
        <pre>
          <code>
            ├── Genre
            │   └── Show Title
            │       └── Season X
            │           ├── S0XE0Y - Episode Title.mp4
          </code>
        </pre>
        <table class="table">
          <thead>
            <tr><td colSpan="2"><h4>Controls</h4></td></tr>
            <tr>
              <th>Control</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><BButton variant="success">+</BButton></td>
              <td>Process the items in the selected organizational unit into the LOE.</td>
            </tr>
            <tr>
              <td><BButton variant="info">~</BButton></td>
              <td>Batch update properties on the selected organizational unit.</td>
            </tr>
            <tr>
              <td><BButton variant="danger">x</BButton></td>
              <td>Delete all items in the selected organizational unit from the server.</td>
            </tr>
            <tr>
              <td><BButton variant="info">WIKI</BButton></td>
              <td>Open a new tab, searching the selected organizational unit on <a href="https://www.wikipedia.org/" target="_blank">Wikipedia.com</a></td>
            </tr>
          </tbody>
        </table>
      </BCol>
    </BRow>
    <BRow>
      <BCol>
        <h3>Comics</h3>
        <p>
          The API scans <code>/holding_bay/tv/</code> for <code>.cbr</code> and <code>.cbz</code> files. <a href="https://github.com/outlawdesigns-io/ComicVine">Comic Vine API</a>
          and returns all files in a flat list. Verify results and update properties as needed.
        </p>
        <table class="table">
          <thead>
            <tr><td colSpan="2"><h4>Controls</h4></td></tr>
            <tr>
              <th>Control</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><BButton variant="info">CV</BButton></td>
              <td>Open a new tab, searching the parsed series title on <a href="https://comicvine.gamespot.com/" target="_blank">Comicvine.Gamespot.com</a></td>
            </tr>
            <tr>
              <td><BButton variant="info">></BButton></td>
              <td>
                Open a new window and open the archive in your browser.
                <br>
                Use This to make sure it is what you think it is.
              </td>
            </tr>
            <tr>
              <td><BButton variant="success">+</BButton></td>
              <td>Process the items in the selected organizational unit into the LOE.</td>
            </tr>
            <tr>
              <td><BButton variant="danger">x</BButton></td>
              <td>Delete all items in the selected organizational unit from the server.</td>
            </tr>
          </tbody>
        </table>
        <BListGroup>
          <BListGroupItem>Notes</BListGroupItem>
          <BListGroupItem>Intended server-side naming scheme: <code>Publisher Name/Series Title 001 (1984)</code></BListGroupItem>
        </BListGroup>
      </BCol>
    </BRow>
  </BContainer>
</template>
