import {useMemo} from 'react'
import ReactMarkdown from 'react-markdown'
import {
    Text,
    Heading
} from '@chakra-ui/react'

import testMD from '../markdown/test.md?raw'


// TODO: importing MD file as a raw string, improve the extensibility of it
// TODO: separate "main.MD" files from "drawer.MD" files
function MarkdownRenderer( content ) {
    console.log(testMD)
    //  TODO: Component override
    const components =  useMemo(() => ({
        h1: (props) => <Heading size="lg" {...props}/>,
        h2: (props) => <Heading size="md" {...props}/>,
        p: (props) => <Text {...props}/>
    }))
  return (
    <ReactMarkdown
        // TODO: This is our component 
        components = {components}
    >
        {testMD}
    </ReactMarkdown>
    // <div>MarkdownRenderer</div>
    
  )
}

export default MarkdownRenderer