
import { createDataItemSigner, message, dryrun } from "@permaweb/aoconnect/browser";

export async function connectWallet() {
    try {
      // connect to the ArConnect browser extension
      await window.arweaveWallet.connect(
        // request permissions
        ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
      );
    } catch (error) {
      alert('You should connect to ArConnect browser extension.');
      console.info(error)
      return false;
    }
  
    return true;
  }
  
  export async function getWalletAddress() {
    let address;
    try {
      address = await window.arweaveWallet.getActiveAddress();
    } catch (error) {
      return '';
    }
  
    return address;
  }

  export function getShortId(id) {
    return id.slice(0, 6) + '...' + id.slice(-6);
  }

  export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  export async function fetchGraphQL(queryObject) {
    const response = await fetch('https://arweave.net/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN',
      },
      body: JSON.stringify(queryObject),
    });
  
    const data = await response.json();
    return data.data.transactions.edges;
  }

  export async function getProcessList(owner) {
    let start = performance.now();
    console.log('==> [getProcessList]');
  
    const queryObject = {
      query:
        `{
            transactions (
              first: 100,
              owners: "${owner}",
              tags: [
                { name: "Data-Protocol", values: ["ao"] },
                { name: "Type", values: ["Process"] }
              ]
            ) {
              edges {
                node {
                  id,
                  tags {
                    name,
                    value
                  }
                }
              }
            }
          }`
    };
  
    try {
      let response = await fetchGraphQL(queryObject);
  
      let end = performance.now();
      console.log(`<== [getProcessList] [${Math.round(end - start)} ms]`);
  
      if (response.length == 0)
        return [];
      else
        return response
            .filter(item => item.node && item.node.id)
            .map(item => item.node.id);
    } catch (error) {
      console.log("getProcessList -> ERR:", error);
      return [];
    }
  }

  export async function evaluate(process, data) {
    try {
      const messageId = await message({
        process,
        signer: createDataItemSigner(window.arweaveWallet),
        tags: [{ name: 'Action', value: 'Eval' }],
        data
      });
    //   console.info(messageId)
      return messageId;
    } catch (error) {
      console.log("evaluate --> error:", error)
      return '';
    }
  }

  export async function send(process, tags, data) {
    try {
      let tags_array = Object.entries(tags).map(([name, value]) => ({ name, value }));
    
      const messageId = await message({
        process,
        signer: createDataItemSigner(window.arweaveWallet),
        tags: tags_array,
        data
      });
  
      return messageId;
    } catch (error) {
      console.log("send --> error:", error)
      return '';
   }
  }

  export async function dryrunSafe(process, tags) {
    try {
        let result;
        let tags_array = Object.entries(tags).map(([name, value]) => ({ name, value }));

        result = await dryrun({
          process: process,
          tags: tags_array,
        });

        return result;
      } catch (error) {
        console.log('tempGetDataFromAO --> ERR:', error)
        return '';
      }
  }